"""
Automated Production Security & Reliability Audit Test Suite for Intervibe AI.
Uses Python built-in unittest framework for zero-dependency execution.
Verifies RCE prevention, AST code sanitization, client IP resolution, email masking,
and percentile boundaries.
"""
import sys
import os
import unittest
from pathlib import Path
from unittest.mock import MagicMock

# Add backend directory to sys.path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from api.code_execution import validate_code_safety
from rate_limiter import get_client_ip
from routes.leaderboard_routes import mask_email, Math_percentile


class TestCodeExecutionSecurity(unittest.TestCase):
    """Audit tests ensuring arbitrary code execution (RCE) is impossible."""

    def test_benign_algorithm_code_passes(self):
        """Legitimate algorithm code should pass AST safety inspection."""
        code = """
def twoSum(nums, target):
    lookup = {}
    for i, n in enumerate(nums):
        diff = target - n
        if diff in lookup:
            return [lookup[diff], i]
        lookup[n] = i
    return []

print(twoSum([2, 7, 11, 15], 9))
"""
        violation = validate_code_safety(code, "python")
        self.assertIsNone(violation, f"Expected benign code to pass, but got: {violation}")

    def test_blocks_os_import(self):
        """Attempts to import os must be caught by AST validation."""
        code = "import os\nos.system('whoami')"
        violation = validate_code_safety(code, "python")
        self.assertIsNotNone(violation)
        self.assertIn("os", violation)

    def test_blocks_subprocess_import(self):
        """Attempts to import subprocess must be rejected."""
        code = "from subprocess import Popen\nPopen(['cat', '/etc/passwd'])"
        violation = validate_code_safety(code, "python")
        self.assertIsNotNone(violation)
        self.assertIn("subprocess", violation)

    def test_blocks_dunder_import(self):
        """Attempts to use __import__ bypass must be caught."""
        code = "mod = __import__('os')\nmod.system('ls')"
        violation = validate_code_safety(code, "python")
        self.assertIsNotNone(violation)
        self.assertIn("__import__", violation)

    def test_blocks_file_open_call(self):
        """File open calls must be prohibited."""
        code = "f = open('.env', 'r')\nsecret = f.read()"
        violation = validate_code_safety(code, "python")
        self.assertIsNotNone(violation)
        self.assertIn("open", violation)

    def test_blocks_eval_call(self):
        """Dynamic eval calls must be rejected."""
        code = "eval(\"__import__('os').system('dir')\")"
        violation = validate_code_safety(code, "python")
        self.assertIsNotNone(violation)
        self.assertIn("eval", violation)

    def test_blocks_javascript_child_process(self):
        """Node child_process calls must be blocked."""
        code = "const { exec } = require('child_process'); exec('ls');"
        violation = validate_code_safety(code, "javascript")
        self.assertIsNotNone(violation)

    def test_blocks_cpp_system_call(self):
        """C++ system execution calls must be blocked."""
        code = "#include <cstdlib>\nint main() { system(\"rm -rf /\"); }"
        violation = validate_code_safety(code, "cpp")
        self.assertIsNotNone(violation)


class TestClientIpResolution(unittest.TestCase):
    """Audit tests ensuring reverse proxy client IP resolution works correctly."""

    def test_extracts_first_ip_from_forwarded_for(self):
        """When behind Nginx, X-Forwarded-For should yield the real client IP."""
        mock_req = MagicMock()
        mock_req.headers = {"x-forwarded-for": "203.0.113.195, 10.0.0.1, 172.20.0.2"}
        mock_req.client.host = "172.20.0.2"

        client_ip = get_client_ip(mock_req)
        self.assertEqual(client_ip, "203.0.113.195")

    def test_extracts_real_ip_header(self):
        """Honors X-Real-IP when present."""
        mock_req = MagicMock()
        mock_req.headers = {"x-real-ip": "198.51.100.42"}
        mock_req.client.host = "127.0.0.1"

        client_ip = get_client_ip(mock_req)
        self.assertEqual(client_ip, "198.51.100.42")

    def test_falls_back_to_client_host_when_no_headers(self):
        """Falls back to request.client.host for direct local requests."""
        mock_req = MagicMock()
        mock_req.headers = {}
        mock_req.client.host = "192.168.1.10"

        client_ip = get_client_ip(mock_req)
        self.assertEqual(client_ip, "192.168.1.10")


class TestLeaderboardPrivacy(unittest.TestCase):
    """Audit tests verifying candidate email and privacy masking."""

    def test_masks_standard_email(self):
        """Candidate email should be masked to prevent scraping."""
        masked = mask_email("alex.miller@gmail.com")
        self.assertEqual(masked, "a***@gmail.com")
        self.assertNotIn("alex.miller", masked)

    def test_masks_short_email_user(self):
        """Short username part should still be cleanly masked."""
        masked = mask_email("me@example.org")
        self.assertEqual(masked, "m***@example.org")

    def test_handles_empty_or_malformed_email(self):
        """Empty or invalid email should return safe placeholder."""
        self.assertEqual(mask_email(""), "candidate@intervibe.ai")
        self.assertEqual(mask_email("invalid_string"), "candidate@intervibe.ai")

    def test_percentile_calculation_boundaries(self):
        """Percentile score must be bounded between 1 and 99."""
        self.assertTrue(1 <= Math_percentile(100, 50) <= 99)
        self.assertTrue(1 <= Math_percentile(0, 0) <= 99)


if __name__ == "__main__":
    unittest.main()

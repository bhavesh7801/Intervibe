import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ProfileSidebar from '../components/profile/ProfileSidebar.jsx';
import StatsOverviewGrid from '../components/profile/StatsOverviewGrid.jsx';
import ResumeUploaderCard from '../components/profile/ResumeUploaderCard.jsx';
import ActivityHeatmap from '../components/ActivityHeatmap.jsx';
import RecentActivitySection from '../components/profile/RecentActivitySection.jsx';
import EditProfileModal from '../components/profile/EditProfileModal.jsx';
import CertificateModal from '../components/profile/CertificateModal.jsx';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [showCert, setShowCert] = useState(false);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 4-Stat Overview Grid */}
      <StatsOverviewGrid user={user} />

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Sidebar */}
        <div className="lg:col-span-4">
          <ProfileSidebar
            user={user}
            onEditProfile={() => setShowEdit(true)}
            onOpenCertificate={() => setShowCert(true)}
          />
        </div>

        {/* Right Dynamic Activity & Resume */}
        <div className="lg:col-span-8 space-y-6">
          <ResumeUploaderCard />
          <ActivityHeatmap streakDays={user?.streakDays || 5} totalSessions={user?.interviewsCompleted || 12} />
          <RecentActivitySection />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        user={user}
        onSave={(updated) => updateUser(updated)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        user={user}
      />
    </div>
  );
};

export default Profile;

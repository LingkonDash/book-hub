import { getUserSession } from '@/lib/core/session';
import React from 'react';
import { FiUser, FiMail, FiCalendar, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ProfilePage = async () => {
  const user = await getUserSession();

  // Fallback data for safety in case session is null or loading improperly
  const userData = user

  // Convert role to clean display text
  const displayRole = userData.userRole === 'user' ? 'Reader' : userData.userRole.charAt(0).toUpperCase() + userData.userRole.slice(1);

  // Format the creation date nicely
  const joinDate = userData.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 pt-15 md:mt-0 bg-gradient-to-br from-slate-50 to-slate-100/50">
      <div className="w-full max-w-xl bg-white border border-slate-100 shadow-xl rounded-3xl overflow-hidden relative group transition-all duration-300 hover:shadow-2xl">
        
        {/* Decorative Top Accent Layer with Brand Color Variations */}
        <div className="h-32 bg-gradient-to-r from-[#fc4a32] to-[#fc4a32]/85 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,212,222,0.3),transparent_60%)]" />
          
          {/* Subtle Role Floating Badge in Header */}
          <div className="absolute top-4 right-6 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 tracking-wide uppercase">
            {displayRole} Platform Account
          </div>
        </div>

        {/* Profile Details Grid Container */}
        <div className="px-6 pb-8 pt-0 relative flex flex-col items-center">
          
          {/* Avatar Container Circle Layer */}
          <div className="relative -mt-16 mb-4 z-10">
            <div className="w-32 h-32 rounded-2xl bg-white p-1.5 shadow-md border border-slate-100">
              {userData.image ? (
                <img 
                  src={userData.image} 
                  alt={userData.name} 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-[#fad4de]/50 flex items-center justify-center rounded-xl text-[#fc4a32]">
                  <FiUser className="w-14 h-14" />
                </div>
              )}
            </div>
            
            {/* Embedded Visual System Status Indicator (Banned / Active state) */}
            <span className={`absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-white font-bold text-xs shadow ${userData.banned ? 'bg-red-500' : 'bg-emerald-500'}`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${userData.banned ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
            </span>
          </div>

          {/* User Primary Header Info */}
          <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">
            {userData.name}
          </h2>
          
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2">
            <span className="bg-[#fad4de] text-[#fc4a32] text-xs font-bold px-3 py-1 rounded-xl tracking-wide uppercase">
              {displayRole}
            </span>
            
            {userData.banned ? (
              <span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-0.5 rounded-xl border border-red-100 flex items-center gap-1">
                <FiXCircle /> Suspended
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-0.5 rounded-xl border border-emerald-100 flex items-center gap-1">
                <FiCheckCircle /> Account Active
              </span>
            )}
          </div>

          {/* Separation Divider Grid */}
          <div className="w-full my-6 border-t border-slate-100" />

          {/* Static Detailed Account Specifications Grid Block */}
          <div className="w-full space-y-4">
            
            {/* Row 1: Email Address Card Row */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/40 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-slate-400 border border-slate-100">
                  <FiMail className="w-4 h-4 text-[#fc4a32]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-700">{userData.email}</p>
                </div>
              </div>
              <div>
                {userData.emailVerified ? (
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">Verified</span>
                ) : (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">Pending</span>
                )}
              </div>
            </div>

            {/* Row 2: Account Id Key Row */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/40 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-slate-400 border border-slate-100">
                  <FiShield className="w-4 h-4 text-[#fc4a32]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account ID Key</p>
                  <p className="text-sm font-mono font-medium text-slate-500 max-w-[200px] truncate md:max-w-none">{userData.id}</p>
                </div>
              </div>
            </div>

            {/* Row 3: Account Membership Joined Date Row */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/40 transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl text-slate-400 border border-slate-100">
                  <FiCalendar className="w-4 h-4 text-[#fc4a32]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-semibold text-slate-700">{joinDate}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
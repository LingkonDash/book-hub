'use client';

import { updateUser } from '@/lib/action/admin/updateUser';
import { deleteUser } from '@/lib/action/admin/deleteUser';
import Image from 'next/image';
import React, { useState, useTransition, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ROLES = ['user', 'librarian', 'admin'];

const ROLE_CONFIG = {
  admin:     { badge: 'bg-red-50 text-red-600 border border-red-200',   dot: 'bg-red-400'   },
  librarian: { badge: 'bg-blue-50 text-blue-600 border border-blue-200', dot: 'bg-blue-400' },
  user:      { badge: 'bg-gray-100 text-gray-500 border border-gray-200', dot: 'bg-gray-400' },
};

// ── Delete confirmation modal ─────────────────────────────────
function DeleteConfirmModal({ user, onConfirm, onCancel, isDeleting }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <FiAlertTriangle className="text-red-500 w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div>
          <h2 className="text-base font-bold text-slate-800 leading-snug mb-1">
            Delete this user?
          </h2>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{user.name}</span> ({user.email}) will be permanently removed. This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
          >
            {isDeleting && (
              <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-white rounded-full animate-spin" />
            )}
            {isDeleting ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Role badge ────────────────────────────────────────────────
function RoleBadge({ role }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.user;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap capitalize ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {role}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ user, size = 32 }) {
  // Strip query params from image URL to avoid Next.js image optimizer issues
  const safeImage = user.image?.split('?')[0] ?? null;
  const cls = size === 36
    ? 'w-9 h-9 text-sm'
    : 'w-8 h-8 text-xs';

  return (
    <div className={`${cls} rounded-full bg-[#fce8e5] flex items-center justify-center shrink-0 overflow-hidden text-[#fc4a32] font-bold`}>
      {safeImage
        ? <Image src={safeImage} alt={user.name} width={size} height={size} className="rounded-full object-cover w-full h-full" />
        : user.name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── Role change buttons ───────────────────────────────────────
function RoleButtons({ user, isSelf, onRoleChange, onDeleteClick, isPending, loadingAction, size = 'md' }) {
  const otherRoles = ROLES.filter((r) => r !== user.userRole);
  const gap = size === 'sm' ? 'gap-1' : 'gap-1.5';
  const px  = size === 'sm' ? 'px-3'  : 'px-3';

  return (
    <div className={`flex flex-wrap items-center ${gap}`}>
      {otherRoles.map((role) => {
        const key = `role-${user._id}-${role}`;
        return (
          <button
            key={role}
            onClick={() => onRoleChange(user._id, role)}
            disabled={isPending}
            title={`Change role to ${role}`}
            className={`inline-flex items-center gap-1.5 ${px} py-1.5 rounded-lg text-xs font-semibold border
              transition-all duration-150 active:scale-[0.97]
              disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer capitalize
              bg-[#fff5f4] text-[#fc4a32] border-[#fce8e5] hover:bg-[#fce8e5]`}
          >
            {loadingAction === key && (
              <span className="w-3 h-3 border-2 border-[#fce8e5] border-t-[#fc4a32] rounded-full inline-block animate-spin" />
            )}
            Make {role}
          </button>
        );
      })}

      <button
        onClick={() => onDeleteClick(user)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 ${px} py-1.5 rounded-lg text-xs font-semibold border
          transition-all duration-150 active:scale-[0.97]
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
          bg-red-50 text-red-600 border-red-200 hover:bg-red-100`}
      >
        {loadingAction === `delete-${user._id}` && (
          <span className="w-3 h-3 border-2 border-red-200 border-t-red-500 rounded-full inline-block animate-spin" />
        )}
        Delete
      </button>
    </div>
  );
}

// ── Mobile card ───────────────────────────────────────────────
function UserCard({ user, isSelf, onRoleChange, onDeleteClick, isPending, loadingAction }) {
  return (
    <div className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 ${isSelf ? 'border-[#fc4a32]/20' : 'border-[#fce8e5]'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar user={user} size={36} />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-700 truncate flex items-center gap-1.5">
              {user.name}
              {isSelf && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fce8e5] text-[#fc4a32]">You</span>}
            </div>
            <div className="text-xs text-slate-400 truncate">{user.email}</div>
          </div>
        </div>
        <RoleBadge role={user.userRole} />
      </div>

      <div>
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#fc4a32]">Joined</span>
        <div className="text-xs text-slate-500 mt-0.5">
          {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </div>
      </div>

      <div className="pt-1 border-t border-[#fce8e5]">
        <RoleButtons
          user={user} isSelf={isSelf}
          onRoleChange={onRoleChange} onDeleteClick={onDeleteClick}
          isPending={isPending} loadingAction={loadingAction}
          size="sm"
        />
      </div>
    </div>
  );
}

// ── Table row ─────────────────────────────────────────────────
function UserRow({ user, isSelf, onRoleChange, onDeleteClick, isPending, loadingAction }) {
  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <tr className={`border-b border-slate-100 transition-colors duration-150 ${isSelf ? 'bg-[#fff9f8]' : 'hover:bg-[#fff5f4]'}`}>
      <td className="px-5 py-4 align-middle">
        <div className="flex items-center gap-3">
          <Avatar user={user} size={32} />
          <div>
            <div className="text-sm font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
              {user.name}
              {isSelf && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#fce8e5] text-[#fc4a32]">You</span>}
            </div>
            <div className="text-xs text-slate-400">{user.email}</div>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 align-middle whitespace-nowrap">
        <RoleBadge role={user.userRole} />
      </td>

      <td className="px-5 py-4 align-middle whitespace-nowrap">
        <span className="text-xs text-slate-500">{joinedDate}</span>
      </td>

      <td className="px-5 py-4 flex justify-end align-middle text-right whitespace-nowrap">
        <RoleButtons
          user={user} isSelf={isSelf}
          onRoleChange={onRoleChange} onDeleteClick={onDeleteClick}
          isPending={isPending} loadingAction={loadingAction}
          size="md"
        />
      </td>
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────
const UserManagementTable = ({ users = [], currentUser }) => {
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // user object to confirm delete
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const headers = ['User', 'Role', 'Joined', 'Actions'];

  const handleRoleChange = (uid, newRole) => {
    // Self-guard (belt-and-suspenders, UI already hides buttons)
    if (uid === currentUser?.id) {
      toast.warning("You can't change your own role.");
      return;
    }
    setLoadingAction(`role-${uid}-${newRole}`);
    startTransition(async () => {
      try {
        const res = await updateUser(uid, newRole);
        if (res?.modifiedCount > 0) {
          toast.success(`Role updated to ${newRole}.`);
          router.refresh();
        } else {
          toast.error('Failed to update role, try again.');
        }
      } catch {
        toast.error('Something went wrong, try again.');
      } finally {
        setLoadingAction(null);
      }
    });
  };

  const handleDeleteClick = (user) => {
    if (user._id === currentUser?.id) {
      toast.warning("You can't delete your own account.");
      return;
    }
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(deleteTarget._id);
      if (res?.deletedCount > 0) {
        toast.success('User deleted successfully.');
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error('Failed to delete user, try again.');
      }
    } catch {
      toast.error('Something went wrong, try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-[#fce8e5] bg-white shadow-sm py-16 flex flex-col items-center gap-2 text-slate-400">
        <span className="text-2xl">👥</span>
        <span className="text-sm font-medium">No users found.</span>
      </div>
    );
  }

  const rowProps = {
    onRoleChange: handleRoleChange,
    onDeleteClick: handleDeleteClick,
    isPending,
    loadingAction,
  };

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            isSelf={currentUser?.id === user._id}
            {...rowProps}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-2xl border border-[#fce8e5] bg-white shadow-sm">
        <table className="w-full border-collapse text-left min-w-[700px]">
          <thead>
            <tr className="bg-[#fff5f4] border-b border-[#fce8e5]">
              {headers.map((h) => (
                <th
                  key={h}
                  className={`px-5 py-3.5 text-[11px] font-bold tracking-widest uppercase text-[#fc4a32] select-none whitespace-nowrap ${h === 'Actions' ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                isSelf={currentUser?.id === user._id}
                {...rowProps}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagementTable;
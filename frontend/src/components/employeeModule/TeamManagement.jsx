import React from 'react'

const TeamManagement = () => {
  return (
    <div className='flex justify-center items-center overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8'>
      <h1 className='text-2xl font-bold text-slate-800'>Team Management</h1>
      <p className='text-slate-500'>Manage your team members and their roles and permissions.</p>
      <div className='flex justify-center items-center overflow-y-auto bg-white scrollbar-hide w-full h-full pb-8'>
        <button className='bg-[#3A565A] text-white px-4 py-2 rounded-md hover:bg-[#3A565A]/80 transition-colors'>Add Team Member</button>
      </div>
    </div>
  )
}

export default TeamManagement 
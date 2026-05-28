import { useEffect, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import userService from '../services/userService'
import { USER_ROLES } from '../utils/constants'
import toast from 'react-hot-toast'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editRole, setEditRole] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (userId, currentRole) => {
    setEditingId(userId)
    setEditRole(currentRole)
  }

  const handleSaveRole = async (userId) => {
    try {
      await userService.updateUserRole(userId, editRole)
      toast.success('User role updated')
      fetchUsers()
      setEditingId(null)
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      await userService.deleteUser(userId)
      toast.success('User deleted')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{user.fullName}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">
                    {editingId === user._id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        {Object.entries(USER_ROLES).map(([key, value]) => (
                          <option key={key} value={value}>{key}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="capitalize">{user.role || 'viewer'}</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.accountStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex gap-2">
                    {editingId === user._id ? (
                      <>
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditRole(user._id, user.role)}
                          className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                        >
                          <MdDelete size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

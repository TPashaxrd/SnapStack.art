import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { BiUser, BiImage, BiComment, BiLock, BiTrash, BiEdit, BiSearch, BiCopy } from "react-icons/bi";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { BsBan } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { FcOk } from "react-icons/fc";

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

interface Stats {
  UserCount: number;
  ArtCount: number;
  CommentsCount: number;
  SubsCount: number;
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface Comment {
  user: string;
  comment: string;
  date: string;
}

interface Art {
  _id: string;
  user: User;
  title: string;
  imageUrl: string;
  comments: Comment[];
  tags: string[];
  likes: number;
  likedBy: string[];
  view: number;
  date: string;
}

const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-fadeIn">
        <button className="absolute top-3 right-4 text-white text-xl" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const Admin: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ UserCount: 0, ArtCount: 0, CommentsCount: 0, SubsCount: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [arts, setArts] = useState<Art[]>([]);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editArt, setEditArt] = useState<Art | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "users" | "arts">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const checkPassword = async () => {
    try {
      const [totalsRes, usersRes, artsRes] = await Promise.all([
        axios.post("http://localhost:5000/api/dashboard/totals", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/users", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/arts", { password }, { withCredentials: true })
      ]);
      setArts(artsRes.data.arts || []);
      setUsers(usersRes.data.users || []);
      if (totalsRes.data.success) {
        setStats(totalsRes.data.dashboard);
        setIsAdmin(true);
        setAuthMessage("✅ Access granted");
      } else {
        setIsAdmin(false);
        setAuthMessage("❌ Invalid password");
      }
    } catch {
      setIsAdmin(false);
      setAuthMessage("❌ Error occurred");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/dashboard/users/${id}`, {
        data: { password },
        withCredentials: true,
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("❌ Failed to delete user");
    }
  };

  const deleteArt = async (id: string) => {
    if (!confirm("Delete this art?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/dashboard/arts/${id}`, {
        data: { password },
        withCredentials: true,
      });
      setArts(arts.filter((a) => a._id !== id));
    } catch {
      alert("❌ Failed to delete art");
    }
  };

  const saveEditUser = async () => {
    if (!editUser) return;
    try {
      await axios.put(`http://localhost:5000/api/dashboard/users/${editUser._id}`, { ...editUser, password }, { withCredentials: true });
      setUsers(users.map(u => u._id === editUser._id ? editUser : u));
      setModalVisible(false);
    } catch {
      alert("❌ Update failed");
    }
  };

  const saveEditArt = async () => {
    if (!editArt) return;
    try {
      await axios.put(`http://localhost:5000/api/dashboard/arts/${editArt._id}`, { ...editArt, password }, { withCredentials: true });
      setArts(arts.map(a => a._id === editArt._id ? editArt : a));
      setModalVisible(false);
    } catch {
      alert("❌ Failed to update art");
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cards = [
    { icon: <BiUser size={32} />, label: "Users", value: stats.UserCount, color: "indigo" },
    { icon: <BiImage size={32} />, label: "Arts", value: stats.ArtCount, color: "blue" },
    { icon: <BiComment size={32} />, label: "Comments", value: stats.CommentsCount, color: "emerald" },
    { icon: <BiLock size={32} />, label: "Subscribers", value: stats.SubsCount, color: "pink" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white font-sans p-4 md:p-6 flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-60 bg-gray-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-xl font-bold text-indigo-400 mb-4">Admin Panel</h2>
          <ul className="space-y-2">
            {["dashboard", "arts", "users"].map(section => (
              <li
                key={section}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${activeSection === section ? "bg-indigo-600 font-inter" : "hover:bg-indigo-500/30"}`}
                onClick={() => setActiveSection(section as "dashboard" | "users" | "arts")}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            ))}
          </ul>
          <ul className="space-y-2">
            <li
              onClick={() => { setIsAdmin(false); setAuthMessage(""); }}
              className="mt-3 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:bg-red-700 hover:scale-105 active:scale-95 select-none"
            >
              EXIT
            </li>
          </ul>
        </aside>

        <main className="flex-1">
          {!isAdmin ? (
            <div className="max-w-sm mx-auto bg-gray-800 rounded-xl p-6 shadow-lg space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={checkPassword} className="w-full py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 font-medium">
                Verify
              </button>
              {authMessage && <p className={`text-sm ${isAdmin ? "text-green-400" : "text-red-400"}`}>{authMessage}</p>}
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {cards.map(({ icon, label, value, color }) => (
                    <div key={label} className={`bg-${color}-600 rounded-xl p-5 text-center shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2`}>
                      {icon}
                      <h3 className="text-2xl font-bold">{value}</h3>
                      <p className="text-sm">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSection === "arts" && (
                <div className="overflow-x-auto bg-gray-900 rounded-xl shadow-lg p-4">
                  <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Arts Management</h2>
                  <table className="min-w-full table-auto border-collapse text-sm text-left text-white">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Tags</th>
                        <th className="px-4 py-2">Likes</th>
                        <th className="px-4 py-2">Comments</th>
                        <th className="px-4 py-2">Views</th>
                        <th className="px-4 py-2">User</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arts.map((art, index) => (
                        <tr key={art._id} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.title}</td>
                          <td className="px-4 py-2">
                            <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} className="w-16 h-16 object-cover rounded" />
                          </td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.tags.join(", ")}</td>
                          <td className="px-4 py-2 text-center">{art.likes}</td>
                          <td className="px-4 py-2 text-center">{art.comments.length}</td>
                          <td className="px-4 py-2 text-center">{art.view}</td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.user.username}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button title="Update Art" onClick={() => { setEditArt(art); setModalVisible(true); }} className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white">
                              <BiEdit size={16} />
                            </button>
                            <button title="Delete Art" onClick={() => deleteArt(art._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white">
                              <BiTrash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSection === "users" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-indigo-300">Users</h2>
                    <div className="relative text-gray-400">
                      <BiSearch className="absolute left-2 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-8 pr-3 py-1 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto bg-gray-800 rounded-xl shadow-lg">
                    <table className="min-w-full divide-y divide-gray-700 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Avatar</th>
                          <th className="px-4 py-2 text-left">Username</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Bio</th>
                          <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {filteredUsers.map(user => (
                          <tr key={user._id}>
                            <td className="px-4 py-2">
                              <img src={`http://localhost:5000${user.avatarUrl}`} alt={user.username} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                            </td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2 truncate max-w-xs">{user.bio}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <button onClick={() => { setEditUser(user); setModalVisible(true); }} title="Edit User" className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 text-white">
                                <BiEdit />
                              </button>
                              <button onClick={() => deleteUser(user._id)} title="Delete User" className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white">
                                <BsBan />
                              </button>
                              <button
                                title="Copy to Clipboard"
                                onClick={() => {
                                  navigator.clipboard.writeText(`User ID: ${user._id}`);
                                  toast.success(`Successfully Copied!`, { style: { fontFamily: 'Inter, serif', backgroundColor: 'black', color: 'white' }, icon: <FcOk /> });
                                }}
                                className="p-2 bg-gray-500 rounded-lg hover:bg-red-600 text-white"
                              >
                                <BiCopy />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
                {editUser && (
                  <>
                    <h2 className="text-lg font-bold mb-3">Edit User</h2>
                    <input type="text" value={editUser.username} onChange={e => setEditUser({ ...editUser!, username: e.target.value })} placeholder="Username" className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white" />
                    <input type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser!, email: e.target.value })} placeholder="Email" className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white" />
                    <textarea value={editUser.bio || ""} onChange={e => setEditUser({ ...editUser!, bio: e.target.value })} placeholder="Bio" className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white" />
                    <button onClick={saveEditUser} className="w-full py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 font-medium">Save</button>
                  </>
                )}

                {editArt && (
                  <>
                    <h2 className="text-lg font-bold mb-3">Edit Art</h2>
                    <input type="text" value={editArt.title} onChange={e => setEditArt({ ...editArt!, title: e.target.value })} placeholder="Title" className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white" />
                    <input type="text" value={editArt.tags.join(", ")} onChange={e => setEditArt({ ...editArt!, tags: e.target.value.split(",").map(t => t.trim()) })} placeholder="Tags (comma separated)" className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white" />
                    <button onClick={saveEditArt} className="w-full py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 font-medium">Save</button>
                  </>
                )}
              </Modal>
            </>
          )}
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
};

export default Admin;

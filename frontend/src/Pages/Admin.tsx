import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { BiUser, BiImage, BiComment, BiLock, BiTrash, BiEdit, BiSearch } from "react-icons/bi";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "users">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const checkPassword = async () => {
    try {
      const [totalsRes, usersRes] = await Promise.all([
        axios.post("http://localhost:5000/api/dashboard/totals", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/users", { password }, { withCredentials: true }),
      ]);
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

  const saveEdit = async () => {
    if (!editUser) return;
    try {
      await axios.put(
        `http://localhost:5000/api/dashboard/users/${editUser._id}`,
        { ...editUser, password },
        { withCredentials: true }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? editUser : u)));
      setModalVisible(false);
    } catch {
      alert("❌ Update failed");
    }
  };

  const filteredUsers = users.filter((u) =>
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
            {["dashboard", "users"].map((section) => (
              <li
                key={section}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  activeSection === section ? "bg-indigo-600 font-inter" : "hover:bg-indigo-500/30"
                }`}
                onClick={() => setActiveSection(section as "dashboard" | "users")}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            ))}
          </ul>
          <ul onClick={() => {
            setIsAdmin(false)
            setAuthMessage("")
          }} className="space-y-2">
            <li className="hover:text-white/50 duration-300 font-inter px-2 rounded-lg text-center cursor-pointer transition-colors hover:bg-gray-800 px-1 py-1">
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
                onChange={(e) => setPassword(e.target.value)}
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
                    <div
                      key={label}
                      className={`bg-${color}-600 rounded-xl p-5 text-center shadow-lg hover:scale-105 transition-transform flex flex-col items-center gap-2`}
                    >
                      {icon}
                      <h3 className="text-2xl font-bold">{value}</h3>
                      <p className="text-sm">{label}</p>
                    </div>
                  ))}
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
                        {filteredUsers.map((user) => (
                          <tr key={user._id}>
                            <td className="px-4 py-2">
                              <img src={`http://localhost:5000${user.avatarUrl}`} alt={user.username} className="w-10 h-10 rounded-full border-2 border-indigo-500" />
                            </td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2 truncate max-w-xs">{user.bio}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <button
                                onClick={() => { setEditUser(user); setModalVisible(true); }} title="Edit User"
                                className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 text-white"
                              >
                                <BiEdit />
                              </button>
                              <button
                                onClick={() => deleteUser(user._id)} title="Delete User"
                                className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white"
                              >
                                <BiTrash />
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
                <h2 className="text-lg font-bold mb-3">Edit User</h2>
                <input
                  type="text"
                  value={editUser?.username || ""}
                  onChange={(e) => setEditUser({ ...editUser!, username: e.target.value })}
                  placeholder="Username"
                  className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white"
                />
                <input
                  type="email"
                  value={editUser?.email || ""}
                  onChange={(e) => setEditUser({ ...editUser!, email: e.target.value })}
                  placeholder="Email"
                  className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white"
                />
                <textarea
                  value={editUser?.bio || ""}
                  onChange={(e) => setEditUser({ ...editUser!, bio: e.target.value })}
                  placeholder="Bio"
                  className="w-full p-2 mb-3 bg-gray-700 rounded-lg text-white"
                />
                <button
                  onClick={saveEdit}
                  className="w-full py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 font-medium"
                >
                  Save
                </button>
              </Modal>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Admin;
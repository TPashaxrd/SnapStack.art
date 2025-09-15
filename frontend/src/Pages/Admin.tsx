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

interface Banneds {
  userUsername: string;
  userEmail: string;
  reason: string;
  date: Date;
  _id: string;
}

interface Contacts {
  _id: string;
  title: string;
  message: string;
  email: string;
  IP_Address: string;
  date: string;
}

interface Reports {
  _id: string;
  user: string[];
  reason: string;
  artId: string;
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
  const [banneds, setBanneds] = useState<Banneds[]>([])
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editArt, setEditArt] = useState<Art | null>(null);
  const [activeSection, setActiveSection] = useState<"dashboard" | "users" | "reports" | "banneds" | "arts" | "contacts">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contacts[]>([])
  const [reports, setReports] = useState<Reports[]>([])

  const checkPassword = async () => {
    try {
      const [totalsRes, usersRes, artsRes, bannedRes, contactRes, reportRes] = await Promise.all([
        axios.post("http://localhost:5000/api/dashboard/totals", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/users", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/arts", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/dashboard/banneds", { password}, { withCredentials: true}),
        axios.post("http://localhost:5000/api/contact/all", { password }, { withCredentials: true }),
        axios.post("http://localhost:5000/api/report/show", { password }, { withCredentials: true })
      ]);
      setReports(reportRes.data.reports || [])
      setContacts(contactRes.data.contacts || []);
      setArts(artsRes.data.arts || []);
      setUsers(usersRes.data.users || []);
      setBanneds(bannedRes.data || [])
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

  const deleteUser = async (id: string, username: string, email: string) => {
    const reason = prompt("Enter ban reason:") || "No reason provided";
    if (!confirm(`Ban & delete user ${username}?`)) return;
  
    try {
      const res = await axios.delete(`http://localhost:5000/api/dashboard/users/${id}`, {
        data: { password, reason, userUserId: id, userEmail: email, userUsername: username },
        withCredentials: true,
      });
  
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== id));
        toast.success(`User ${username} banned & deleted`);
      } else {
        toast.error(`❌ Failed: ${res.data.message}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Failed to delete user");
    }
  };
  
  const deleteContact = async (id: string) => {
    if(!confirm("Delete this contact?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/dashboard/contact-delete/${id}`, {
        data: { password },
        withCredentials: true
      })
      
      alert("Successfully deleted.")
    } catch (error) {
      alert("Failed.")
    }
  }

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
      <div className="min-h-screen bg-[#0F0F0F] text-gray-100 font-inter p-4 md:p-6 flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 bg-[#1A1A1A] rounded-2xl p-6 shadow-xl border border-gray-800/50">
          <h2 className="text-2xl font-bold text-[#6B46C1] mb-6 tracking-tight">Admin Panel</h2>
          <ul className="space-y-3">
            {["dashboard", "reports", "arts", "banneds", "users", "contacts"].map(section => (
              <li
                key={section}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeSection === section ? "bg-[#6B46C1] text-white font-medium" : "hover:bg-gray-800/50 text-gray-300 hover:text-[#6B46C1]"}`}
                onClick={() => setActiveSection(section as "dashboard" | "users" | "banneds" | "contacts" | "arts")}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </li>
            ))}
          </ul>
          <ul className="space-y-3">
            <li
              onClick={() => { setIsAdmin(false); setAuthMessage(""); }}
              className="mt-4 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:bg-red-700 hover:scale-105 active:scale-95 select-none"
            >
              EXIT
            </li>
          </ul>
        </aside>

        <main className="flex-1">
          {!isAdmin ? (
            <div className="max-w-sm mx-auto bg-[#1A1A1A] rounded-2xl p-8 shadow-xl border border-gray-800/50 space-y-4">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Admin password"
                className="w-full p-3 bg-[#2D2D2D] rounded-lg border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all"
              />
              <button onClick={checkPassword} className="w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-medium text-white transition-all">
                Verify
              </button>
              {authMessage && <p className={`text-sm ${isAdmin ? "text-green-400" : "text-red-400"}`}>{authMessage}</p>}
            </div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {cards.map(({ icon, label, value }) => (
                    <div key={label} className={`bg-[#1A1A1A] rounded-2xl p-6 text-center shadow-xl border border-gray-800/50 hover:scale-105 transition-all flex flex-col items-center gap-3`}>
                      {icon}
                      <h3 className="text-2xl font-bold text-white">{value}</h3>
                      <p className="text-sm text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
              )}

            {activeSection === "reports" && (
              <div className="overflow-x-auto bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-gray-800/50">
                <h2 className="text-2xl font-semibold text-[#6B46C1] mb-6 tracking-tight">Reports</h2>
                {reports.length === 0 ? (
                  <p className="text-gray-400 text-center">No reports available.</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((item) => (
                      <div
                        key={item._id}
                        className="bg-[#2D2D2D] p-4 rounded-lg border border-gray-800/50 hover:bg-[#3A3A3A] transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex flex-col gap-2">
                          <p className="text-gray-100 text-sm md:text-base font-medium">
                            Reason: {item.reason}
                          </p>
                          <p className="text-gray-400 text-xs md:text-sm">
                            Art ID: {item.artId}
                          </p>
                          <p className="text-gray-500 text-xs md:text-sm">
                            Date: {new Date(item.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

              {activeSection === "contacts" && (
                <div className="overflow-x-auto bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-gray-800/50">
                  <h2 className="text-2xl font-bold text-[#6B46C1] mb-6 tracking-tight">Contacts</h2>
                  <table className="min-w-full divide-y divide-gray-800 text-sm">
                    <thead className="bg-[#2D2D2D]">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-300 uppercase tracking-wider">Title</th>
                        <th className="px-4 py-3 text-left text-gray-300 uppercase tracking-wider">Message</th>
                        <th className="px-4 py-3 text-left text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-gray-300 uppercase tracking-wider">IP Address</th>
                        <th className="px-4 py-3 text-left text-gray-300 uppercase tracking-wider">Controllers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {contacts.map((contact) => (
                        <tr key={contact._id} className="hover:bg-[#2D2D2D] transition-colors duration-200">
                          <td className="px-4 py-2 text-gray-100">{contact.title}</td>
                          <td className="px-4 py-2 text-gray-100">{contact.message}</td>
                          <td className="px-4 py-2 text-gray-100">{contact.email}</td>
                          <td className="px-4 py-2 text-gray-100">{contact.IP_Address}</td>
                          <td onClick={() => deleteContact(contact._id)} className="px-4 py-2 text-red-400 hover:text-red-500 cursor-pointer"><BiTrash size={20} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSection === "banneds" && (
                <div className="overflow-x-auto bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-gray-800/50">
                  <h2 className="text-2xl font-semibold text-[#6B46C1] mb-6 tracking-tight">Banned Users</h2>
                  <table className="min-w-full divide-y divide-gray-800 text-sm">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-gray-300">Username</th>
                        <th className="px-4 py-2 text-left text-gray-300">Email</th>
                        <th className="px-4 py-2 text-left text-gray-300">Reason</th>
                        <th className="px-4 py-2 text-left text-gray-300">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {banneds?.map(banned => (
                        <tr key={banned._id} className="hover:bg-[#2D2D2D] transition-colors">
                          <td className="px-4 py-2 text-gray-100">{banned.userUsername}</td>
                          <td className="px-4 py-2 text-gray-100">{banned.userEmail}</td>
                          <td className="px-4 py-2 text-gray-100">{banned.reason}</td>
                          <td className="px-4 py-2 text-gray-100">{new Date(banned.date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeSection === "arts" && (
                <div className="overflow-x-auto bg-[#1A1A1A] rounded-2xl shadow-xl p-6 border border-gray-800/50">
                  <h2 className="text-2xl font-semibold text-[#6B46C1] mb-6 tracking-tight">Arts Management</h2>
                  <table className="min-w-full table-auto border-collapse text-sm text-left text-gray-100">
                    <thead>
                      <tr className="bg-[#2D2D2D]">
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
                        <tr key={art._id} className="bg-[#1A1A1A] hover:bg-[#2D2D2D] transition-colors">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.title}</td>
                          <td className="px-4 py-2">
                            <img src={`http://localhost:5000${art.imageUrl}`} alt={art.title} className="w-16 h-16 object-cover rounded-lg border border-gray-700" />
                          </td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.tags.join(", ")}</td>
                          <td className="px-4 py-2 text-center">{art.likes}</td>
                          <td className="px-4 py-2 text-center">{art.comments.length}</td>
                          <td className="px-4 py-2 text-center">{art.view}</td>
                          <td className="px-4 py-2 truncate max-w-xs">{art.user.username}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <button title="Update Art" onClick={() => { setEditArt(art); setModalVisible(true); }} className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white transition-all">
                              <BiEdit size={16} />
                            </button>
                            <button title="Delete Art" onClick={() => deleteArt(art._id)} className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-all">
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
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-[#6B46C1] tracking-tight">Users</h2>
                    <div className="relative text-gray-400">
                      <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-3 py-2 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all"
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto bg-[#1A1A1A] rounded-2xl shadow-xl border border-gray-800/50">
                    <table className="min-w-full divide-y divide-gray-800 text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-300">Avatar</th>
                          <th className="px-4 py-2 text-left text-gray-300">Username</th>
                          <th className="px-4 py-2 text-left text-gray-300">Email</th>
                          <th className="px-4 py-2 text-left text-gray-300">Bio</th>
                          <th className="px-4 py-2 text-left text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredUsers.map(user => (
                          <tr key={user._id} className="hover:bg-[#2D2D2D] transition-colors">
                            <td className="px-4 py-2">
                              <img src={`http://localhost:5000${user.avatarUrl}`} alt={user.username} className="w-10 h-10 rounded-full border-2 border-[#6B46C1]" />
                            </td>
                            <td className="px-4 py-2 text-gray-100">{user.username}</td>
                            <td className="px-4 py-2 text-gray-100">{user.email}</td>
                            <td className="px-4 py-2 truncate max-w-xs text-gray-100">{user.bio}</td>
                            <td className="px-4 py-2 flex gap-2">
                              <button onClick={() => { setEditUser(user); setModalVisible(true); }} title="Edit User" className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 text-white transition-all">
                                <BiEdit />
                              </button>
                              <button onClick={() => deleteUser(user._id, user.username, user.email)} title="Delete User" className="p-2 bg-red-500 rounded-lg hover:bg-red-600 text-white transition-all">
                                <BsBan />
                              </button>
                              <button
                                title="Copy to Clipboard"
                                onClick={() => {
                                  navigator.clipboard.writeText(`User ID: ${user._id}`);
                                  toast.success(`Successfully Copied!`, { style: { fontFamily: 'Inter, serif', backgroundColor: '#1A1A1A', color: 'white' }, icon: <FcOk /> });
                                }}
                                className="p-2 bg-gray-500 rounded-lg hover:bg-gray-600 text-white transition-all"
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
                    <h2 className="text-lg font-bold mb-4 text-[#6B46C1] tracking-tight">Edit User</h2>
                    <input type="text" value={editUser.username} onChange={e => setEditUser({ ...editUser!, username: e.target.value })} placeholder="Username" className="w-full p-2 mb-4 bg-[#2D2D2D] rounded-lg text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]" />
                    <input type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser!, email: e.target.value })} placeholder="Email" className="w-full p-2 mb-4 bg-[#2D2D2D] rounded-lg text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]" />
                    <textarea value={editUser.bio || ""} onChange={e => setEditUser({ ...editUser!, bio: e.target.value })} placeholder="Bio" className="w-full p-2 mb-4 bg-[#2D2D2D] rounded-lg text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]" />
                    <button onClick={saveEditUser} className="w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-medium text-white transition-all">Save</button>
                  </>
                )}

                {editArt && (
                  <>
                    <h2 className="text-lg font-bold mb-4 text-[#6B46C1] tracking-tight">Edit Art</h2>
                    <input type="text" value={editArt.title} onChange={e => setEditArt({ ...editArt!, title: e.target.value })} placeholder="Title" className="w-full p-2 mb-4 bg-[#2D2D2D] rounded-lg text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]" />
                    <input type="text" value={editArt.tags.join(", ")} onChange={e => setEditArt({ ...editArt!, tags: e.target.value.split(",").map(t => t.trim()) })} placeholder="Tags (comma separated)" className="w-full p-2 mb-4 bg-[#2D2D2D] rounded-lg text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6B46C1]" />
                    <button onClick={saveEditArt} className="w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-medium text-white transition-all">Save</button>
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
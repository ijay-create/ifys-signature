import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Users,
  X,
  CheckCircle2,
  ChefHat,
} from "lucide-react";
import "../styles/AdminDashboard.css";

const initialOrders = [
  { id: "#IFY-1048", customer: "Amaka Johnson", item: "Large • Mixed", amount: 100, status: "Preparing", time: "10 min ago" },
  { id: "#IFY-1047", customer: "Daniel Okafor", item: "Medium • Chicken", amount: 55, status: "Confirmed", time: "32 min ago" },
  { id: "#IFY-1046", customer: "Sarah Williams", item: "Small • Shrimp", amount: 35, status: "Ready", time: "1 hr ago" },
  { id: "#IFY-1045", customer: "Tolu Adeyemi", item: "Large • Vegetable", amount: 100, status: "Delivered", time: "2 hrs ago" },
];

const initialBookings = [
  { id: 1, name: "Chioma & David", event: "Wedding", date: "Oct 12, 2026", guests: 120, status: "New" },
  { id: 2, name: "Maya Johnson", event: "Birthday", date: "Oct 18, 2026", guests: 35, status: "Contacted" },
  { id: 3, name: "Nexus Creative", event: "Corporate Event", date: "Nov 02, 2026", guests: 80, status: "Quoted" },
];

const initialMenu = [
  { id: 1, name: "Small Pan", servings: "2–4 people", price: 35, protein: "Any protein", active: true },
  { id: 2, name: "Medium Pan", servings: "5–8 people", price: 55, protein: "Any protein", active: true },
  { id: 3, name: "Large Pan", servings: "9–12 people", price: 100, protein: "Any protein", active: true },
];

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [bookings, setBookings] = useState(initialBookings);
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newMenu, setNewMenu] = useState({ name: "", servings: "", price: "" });

  const navItems = [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingBag },
    { label: "Bookings", icon: CalendarDays },
    { label: "Menu & Pricing", icon: FileText },
    { label: "Customers", icon: Users },
    { label: "Messages", icon: MessageSquare },
    { label: "Settings", icon: Settings },
  ];

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        `${order.id} ${order.customer} ${order.item} ${order.status}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter((order) => !["Delivered", "Ready"].includes(order.status)).length;

  const changeOrderStatus = (id, status) => {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const removeMenuItem = (id) => {
    setMenuItems((current) => current.filter((item) => item.id !== id));
  };

  const addMenuItem = (event) => {
    event.preventDefault();
    if (!newMenu.name || !newMenu.servings || !newMenu.price) return;

    setMenuItems((current) => [
      ...current,
      {
        id: Date.now(),
        name: newMenu.name,
        servings: newMenu.servings,
        price: Number(newMenu.price),
        protein: "Any protein",
        active: true,
      },
    ]);

    setNewMenu({ name: "", servings: "", price: "" });
    setShowMenuModal(false);
  };

  const toggleMenuItem = (id) => {
    setMenuItems((current) =>
      current.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const renderOverview = () => (
    <>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--gold"><ShoppingBag size={21} /></div>
          <div><span>Total Orders</span><strong>{orders.length + 42}</strong><small>+12.5% this month</small></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--green"><CircleDollarSign size={21} /></div>
          <div><span>Revenue</span><strong>${(totalRevenue + 2440).toLocaleString()}</strong><small>+8.2% this month</small></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--cream"><CalendarDays size={21} /></div>
          <div><span>Bookings</span><strong>{bookings.length + 17}</strong><small>5 new requests</small></div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--rose"><Clock3 size={21} /></div>
          <div><span>Pending Orders</span><strong>{pendingOrders}</strong><small>Needs attention</small></div>
        </div>
      </div>

      <div className="admin-grid admin-grid--main">
        <section className="admin-panel">
          <div className="admin-panel__header">
            <div><span className="admin-eyebrow">Live activity</span><h2>Recent Orders</h2></div>
            <button className="admin-text-button" onClick={() => setActivePage("Orders")}>View all <ChevronRight size={16} /></button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Order</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id}>
                    <td><strong>{order.id}</strong><span>{order.time}</span></td>
                    <td>{order.customer}</td>
                    <td>{order.item}</td>
                    <td>${order.amount}</td>
                    <td><span className={`admin-status admin-status--${order.status.toLowerCase()}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-panel admin-panel--bookings">
          <div className="admin-panel__header">
            <div><span className="admin-eyebrow">Upcoming</span><h2>Catering Requests</h2></div>
            <button className="admin-icon-button" onClick={() => setActivePage("Bookings")}><ChevronRight size={17} /></button>
          </div>
          <div className="admin-booking-list">
            {bookings.map((booking) => (
              <div className="admin-booking" key={booking.id}>
                <div className="admin-booking__date"><CalendarDays size={17} /><span>{booking.date}</span></div>
                <strong>{booking.name}</strong>
                <span>{booking.event} • {booking.guests} guests</span>
                <div className="admin-booking__footer"><span className={`admin-status admin-status--${booking.status.toLowerCase()}`}>{booking.status}</span><button onClick={() => setActivePage("Bookings")}>Open</button></div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel__header">
          <div><span className="admin-eyebrow">Quick actions</span><h2>Manage Ify&apos;s Signature</h2></div>
        </div>
        <div className="admin-quick-actions">
          <button onClick={() => setActivePage("Orders")}><ShoppingBag size={20} /><span>Manage orders</span><ChevronRight size={17} /></button>
          <button onClick={() => setShowMenuModal(true)}><Plus size={20} /><span>Add menu item</span><ChevronRight size={17} /></button>
          <button onClick={() => setActivePage("Bookings")}><CalendarDays size={20} /><span>Review bookings</span><ChevronRight size={17} /></button>
          <button onClick={() => setActivePage("Messages")}><MessageSquare size={20} /><span>Customer messages</span><ChevronRight size={17} /></button>
        </div>
      </section>
    </>
  );

  const renderOrders = () => (
    <section className="admin-panel">
      <div className="admin-panel__header admin-panel__header--wide">
        <div><span className="admin-eyebrow">Sales management</span><h2>All Orders</h2><p>Review and update customer orders.</p></div>
        <button className="admin-primary-button" onClick={() => setShowOrderModal(true)}><Plus size={17} /> Add order</button>
      </div>
      <div className="admin-toolbar">
        <div className="admin-search"><Search size={17} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search orders..." /></div>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Selection</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td><strong>{order.id}</strong><span>{order.time}</span></td>
                <td>{order.customer}</td>
                <td>{order.item}</td>
                <td>${order.amount}</td>
                <td><span className={`admin-status admin-status--${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>
                  <select className="admin-select" value={order.status} onChange={(event) => changeOrderStatus(order.id, event.target.value)}>
                    <option>Confirmed</option><option>Preparing</option><option>Ready</option><option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderBookings = () => (
    <section className="admin-panel">
      <div className="admin-panel__header">
        <div><span className="admin-eyebrow">Events & catering</span><h2>Booking Requests</h2><p>Keep track of upcoming catering opportunities.</p></div>
      </div>
      <div className="admin-bookings-grid">
        {bookings.map((booking) => (
          <article className="admin-booking-card" key={booking.id}>
            <div className="admin-booking-card__top"><span className="admin-date-chip"><CalendarDays size={16} />{booking.date}</span><span className={`admin-status admin-status--${booking.status.toLowerCase()}`}>{booking.status}</span></div>
            <h3>{booking.name}</h3>
            <p>{booking.event}</p>
            <div className="admin-booking-card__meta"><span><Users size={15} />{booking.guests} guests</span><span><Clock3 size={15} />Catering</span></div>
            <div className="admin-booking-card__actions">
              <button onClick={() => setBookings((current) => current.map((item) => item.id === booking.id ? { ...item, status: "Contacted" } : item))}><CheckCircle2 size={16} /> Mark contacted</button>
              <button className="admin-icon-button"><ChevronRight size={16} /></button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderMenu = () => (
    <section className="admin-panel">
      <div className="admin-panel__header admin-panel__header--wide">
        <div><span className="admin-eyebrow">Products</span><h2>Menu & Pricing</h2><p>Update pan sizes and pricing displayed to customers.</p></div>
        <button className="admin-primary-button" onClick={() => setShowMenuModal(true)}><Plus size={17} /> Add item</button>
      </div>
      <div className="admin-menu-grid">
        {menuItems.map((item) => (
          <article className={`admin-menu-card ${!item.active ? "is-inactive" : ""}`} key={item.id}>
            <div className="admin-menu-card__visual"><ChefHat size={32} /><span>{item.name}</span></div>
            <div className="admin-menu-card__body">
              <div className="admin-menu-card__title"><div><h3>{item.name}</h3><p>{item.servings}</p></div><strong>${item.price}</strong></div>
              <span className="admin-menu-card__protein">{item.protein}</span>
              <div className="admin-menu-card__actions">
                <button onClick={() => toggleMenuItem(item.id)}>{item.active ? "Active" : "Hidden"}</button>
                <button><Pencil size={15} /> Edit</button>
                <button className="danger" onClick={() => removeMenuItem(item.id)}><Trash2 size={15} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderPlaceholder = (title, eyebrow, description, icon) => {
    const Icon = icon;
    return (
      <section className="admin-empty-page">
        <div className="admin-empty-page__icon"><Icon size={31} /></div>
        <span className="admin-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="admin-primary-button" onClick={() => setActivePage("Overview")}>Back to overview</button>
      </section>
    );
  };

  const pageContent = {
    Overview: renderOverview(),
    Orders: renderOrders(),
    Bookings: renderBookings(),
    "Menu & Pricing": renderMenu(),
    Customers: renderPlaceholder("Customers", "Customer management", "Customer profiles and order history will live here when the database is connected.", Users),
    Messages: renderPlaceholder("Messages", "Customer inbox", "Catering enquiries and customer messages will be managed here.", MessageSquare),
    Settings: renderPlaceholder("Settings", "Business settings", "Admin profile, contact details, notification preferences and integrations will live here.", Settings),
  }[activePage];

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo"><ChefHat size={21} /></div>
          <div><strong>Ify&apos;s Signature</strong><span>Admin Dashboard</span></div>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}><X size={19} /></button>
        </div>

        <div className="admin-sidebar__section">
          <span>Workspace</span>
          <nav>
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={activePage === label ? "is-active" : ""}
                onClick={() => { setActivePage(label); setSidebarOpen(false); }}
              >
                <Icon size={18} />
                <span>{label}</span>
                {label === "Orders" && <b>{orders.length}</b>}
                {label === "Bookings" && <b>{bookings.length}</b>}
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar__bottom">
          <div className="admin-sidebar__tip">
            <PackageCheck size={19} />
            <div><strong>Kitchen status</strong><span>Accepting orders</span></div>
            <i />
          </div>
          <button className="admin-sidebar__logout" onClick={onLogout}><LogOut size={18} /> Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button className="admin-mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
            <div><span>Good morning, Ify</span><strong>{activePage}</strong></div>
          </div>
          <div className="admin-topbar__right">
            <div className="admin-notification-wrap">
              <button className="admin-top-icon" onClick={() => setShowNotifications((current) => !current)}><Bell size={19} /><i /></button>
              {showNotifications && (
                <div className="admin-notifications">
                  <strong>Notifications</strong>
                  <p>3 new orders need attention.</p>
                  <p>2 catering requests are waiting.</p>
                </div>
              )}
            </div>
            <div className="admin-profile">
              <div className="admin-profile__avatar">I</div>
              <div><strong>Ify</strong><span>Administrator</span></div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">{activePage === "Overview" ? "Ify&apos;s Signature Fried Rice" : "Management"}</span>
              <h1>{activePage === "Overview" ? "Dashboard overview" : activePage}</h1>
            </div>
            {activePage === "Overview" && <div className="admin-date-label"><CalendarDays size={16} /> September 24, 2026</div>}
          </div>
          {pageContent}
        </div>
      </main>

      {showMenuModal && (
        <div className="admin-modal-backdrop" onMouseDown={() => setShowMenuModal(false)}>
          <div className="admin-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-modal__header"><div><span className="admin-eyebrow">Menu</span><h2>Add menu item</h2></div><button onClick={() => setShowMenuModal(false)}><X size={19} /></button></div>
            <form onSubmit={addMenuItem} className="admin-form">
              <label>Item name<input value={newMenu.name} onChange={(event) => setNewMenu({ ...newMenu, name: event.target.value })} placeholder="Extra Large Pan" required /></label>
              <label>Servings<input value={newMenu.servings} onChange={(event) => setNewMenu({ ...newMenu, servings: event.target.value })} placeholder="13–18 people" required /></label>
              <label>Price<input type="number" min="0" value={newMenu.price} onChange={(event) => setNewMenu({ ...newMenu, price: event.target.value })} placeholder="125" required /></label>
              <button className="admin-primary-button" type="submit"><Plus size={17} /> Add menu item</button>
            </form>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="admin-modal-backdrop" onMouseDown={() => setShowOrderModal(false)}>
          <div className="admin-modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="admin-modal__header"><div><span className="admin-eyebrow">Orders</span><h2>Manual order</h2></div><button onClick={() => setShowOrderModal(false)}><X size={19} /></button></div>
            <div className="admin-modal__message"><CheckCircle2 size={20} /><div><strong>Ready for database integration</strong><p>Online orders will appear here automatically once the customer checkout and backend are connected.</p></div></div>
            <button className="admin-primary-button" onClick={() => setShowOrderModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState } from "react";

export function NotificationCenter({ activity }) {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState([]);

  const unread = activity.filter(a => !read.includes(a.id)).length;

  function markAllRead() { setRead(activity.map(a => a.id)); }

  const typeIcon = t => ({ arrest: "⛓", alert: "🚨", new: "📁", closed: "✅", dispatch: "📡", update: "📋" }[t] || "📋");
  const typeColor = t => ({ arrest: "#f0883e", alert: "#f85149", new: "#388bfd", closed: "#3fb950", dispatch: "#a371f7", update: "#e3b341" }[t] || "#8b949e");

  return (
    <div style={{ position: "relative" }}>
      <button style={s.bell} onClick={() => setOpen(o => !o)}>
        🔔
        {unread > 0 && <span style={s.badge}>{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div style={s.panel}>
          <div style={s.header}>
            <span style={s.title}>Notifications</span>
            <div style={s.headerRight}>
              <span style={s.unreadCount}>{unread} unread</span>
              <button style={s.markRead} onClick={markAllRead}>Mark all read</button>
            </div>
          </div>
          <div style={s.list}>
            {activity.slice(0, 15).map((a, i) => {
              const isUnread = !read.includes(a.id);
              return (
                <div key={a.id || i} style={{ ...s.item, background: isUnread ? "rgba(56,139,253,0.04)" : "transparent" }}
                  onClick={() => setRead(r => [...r, a.id])}>
                  <span style={{ ...s.itemIcon, color: typeColor(a.type) }}>{typeIcon(a.type)}</span>
                  <div style={s.itemInfo}>
                    <div style={s.itemMsg}>{a.msg}</div>
                    <div style={s.itemMeta}>{a.time}{a.country ? ` · ${a.country}` : ""}</div>
                  </div>
                  {isUnread && <span style={s.unreadDot} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {open && <div style={s.backdrop} onClick={() => setOpen(false)} />}
    </div>
  );
}

const s = {
  bell: { background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 14, position: "relative" },
  badge: { position: "absolute", top: -4, right: -4, background: "#f85149", color: "#fff", fontSize: 9, borderRadius: 10, padding: "1px 5px", fontFamily: "'JetBrains Mono', monospace", minWidth: 16, textAlign: "center" },
  panel: { position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 200, overflow: "hidden" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: "1px solid var(--border)" },
  title: { fontSize: 13, fontWeight: 600, color: "var(--text)" },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  unreadCount: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#388bfd" },
  markRead: { background: "none", border: "none", color: "var(--text3)", fontSize: 11, cursor: "pointer" },
  list: { maxHeight: 400, overflowY: "auto" },
  item: { display: "flex", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--border2)", cursor: "pointer", alignItems: "flex-start", transition: "background 0.1s" },
  itemIcon: { fontSize: 14, flexShrink: 0, marginTop: 1 },
  itemInfo: { flex: 1 },
  itemMsg: { fontSize: 12, color: "var(--text)", lineHeight: 1.5, marginBottom: 2 },
  itemMeta: { fontSize: 10, color: "var(--text3)", fontFamily: "'JetBrains Mono', monospace" },
  unreadDot: { width: 6, height: 6, borderRadius: "50%", background: "#388bfd", flexShrink: 0, marginTop: 4 },
  backdrop: { position: "fixed", inset: 0, zIndex: 199 },
};

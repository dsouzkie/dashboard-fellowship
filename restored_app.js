Created At: 2026-07-23T12:58:26+05:30
Completed At: 2026-07-23T12:58:29+05:30

				The command completed successfully.
				Output:
				935:   el.innerHTML = data.map(d =>
936:     `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#94A3B8;">`+
937:     `<div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>`+
938:     `${escapeHTML(d.label)} (${d.value})</div>`
939:   ).join('');
940: }
941: 
942: 
943: // =============================================
944: // SECTION 7: UI COMPONENTS (Reusable render functions)
945: // =============================================
946: 
947: function renderSidebar() {
948:   const v = AppState.currentView;
949:   
950:   return `
951:     <aside class="sidebar">
952:       <div class="sidebar-header" style="text-align: center;">
953:         <img src="team%20photos/logo.png" alt="Under25" style="max-width: 130px; margin-bottom: 10px;" />
954:         <div style="font-weight: bold; font-size: 0.95rem; color: #fff; line-height: 1.2;">Fellowship Tracking<br>Dashboard</div>
955:       </div>
956:       <nav class="sidebar-nav">
957:         <div class="nav-item ${v === 'dashboard' ? 'nav-item--active' : ''}" data-view="dashboard">
958:           <span class="nav-icon">📊</span><span class="nav-label">Overview</span>
959:         </div>
960:         <div class="nav-item ${v === 'my-fellows' ? 'nav-item--active' : ''}" data-view="my-fellows">
961:           <span class="nav-icon">👤</span><span class="nav-label">My Fellows</span>
962:         </div>
963:         <div class="nav-item ${v === 'all-fellows' ? 'nav-item--active' : ''}" data-view="all-fellows">
964:           <span class="nav-icon">👥</span><span class="nav-label">All Fellows</span>
965:         </div>
966:         <div class="nav-item ${v === 'alerts' ? 'nav-item--active' : ''}" data-view="alerts">
967:           <span class="nav-icon">🔔</span><span class="nav-label">Alerts & Transfers</span>
968:         </div>
969:         <div class="nav-item ${v === 'strikes' ? 'nav-item--active' : ''}" data-view="strikes">
970:           <span class="nav-icon">⚡</span><span class="nav-label">Strikes</span>
971:         </div>
972:         <div class="nav-item ${v === 'forms' ? 'nav-item--active' : ''}" data-view="forms">
973:           <span class="nav-icon">📋</span><span class="nav-label">Form Tracker</span>
974:         </div>
975:         <div class="nav-item ${v === 'instagram' ? 'nav-item--active' : ''}" data-view="instagram">
976:           <span class="nav-icon">📸</span><span class="nav-label">Instagram</span>
977:         </div>
978:         <div class="nav-item ${v === 'requests' ? 'nav-item--active' : ''}" data-view="requests">
979:           <span class="nav-icon">📝</span><span class="nav-label">Fellow Requests</span>


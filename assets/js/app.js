// ═══════════════════════════════════════════════════════════════
//  PWA Service Worker (registro normal — /sw.js, ver archivo aparte)
// ═══════════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => log('SW registrado · scope=' + reg.scope, 'log-ok'))
            .catch(err => log('SW error: ' + err.message, 'log-err'));
    });
}

// ═══════════════════════════════════════════════════════════════
//  Install prompt (PWA instalable)
// ═══════════════════════════════════════════════════════════════
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = $('installBtn');
    if (btn) btn.classList.remove('hidden');
    log(L('pwa_available'), 'log-info');
});
window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = $('installBtn');
    if (btn) btn.classList.add('hidden');
    showToast(L('toast_install_success'), 'success');
});

async function installApp() {
    haptic(15);
    if (!deferredInstallPrompt) {
        showToast('App already installed or cannot be installed here', 'info');
        return;
    }
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    log('Install choice: ' + choice.outcome, 'log-info');
    deferredInstallPrompt = null;
    const btn = $('installBtn');
    if (btn) btn.classList.add('hidden');
}


// ═══════════════════════════════════════════════════════════════
//  I18N — language detection + dictionaries
//  Auto-detects browser language (en/es), user can override in UI
// ═══════════════════════════════════════════════════════════════
const I18N = {
    en: {
        // Header / nav
        header_subtitle: 'Monitor BLE · Persistence · History',
        nav_dashboard: 'Dashboard', nav_history: 'History', nav_inspector: 'Inspector',
        live_badge: 'LIVE',
        // Connection card
        status_disconnected: 'Disconnected',
        badge_ble: 'BLE',
        connect_btn: 'Connect SAKO battery',
        reconnect_btn: 'Quick reconnect',
        disconnect_btn: 'Disconnect',
        connecting_status: 'Connecting...',
        connected_to: 'Connected to ',
        auto_reconnected: 'Auto-reconnected',
        connected_remember: 'Connected. Will remember next time.',
        ble_not_available: 'Web Bluetooth not available. Use Chrome/Edge/Samsung Internet.',
        ble_expired: 'BLE permissions expired. Use "Quick reconnect".',
        ble_nosupport: 'Autoconnect not supported. Use "Quick reconnect".',
        searching: 'Searching ',
        reconnect_fail: 'Reconnection failed: ',
        gatt_connected: 'GATT connected',
        connection_error: 'Connection error: ',
        requesting_device: 'Requesting BLE device...',
        requesting: 'Requesting...',
        // Dashboard
        time_remaining: 'Remaining time',
        time_charging: 'Time remaining (charging)',
        time_discharging: 'Time remaining (discharging)',
        time_idle: 'Idle',
        no_significant_current: 'No significant current',
        // BMS status
        fet_charge_on: 'ON', fet_charge_off: 'OFF',
        fet_discharge_on: 'ON', fet_discharge_off: 'OFF',
        balance_active: 'Active', balance_inactive: 'Inactive',
        last_packet: 'Last packet',
        // Stats labels
        stat_voltage: 'Voltage', stat_current: 'Current', stat_power: 'Power',
        stat_cap_rem: 'Cap. rem.', stat_cap_tot: 'Cap. total',
        stat_cycles: 'Cycles', stat_cells: 'Cells',
        stat_sw: 'SW Ver.', stat_protection: 'Protection',
        // Temperatures
        ntc_label: 'NTC ', no_sensors: 'No sensors',
        // Temps
        temperatures: 'Temperatures',
        bms_status: 'BMS Status',
        // History
        trend_chart: 'Trend Chart',
        session_stats: 'Session Statistics',
        stored_readings: 'Stored readings',
        first_reading: 'First reading',
        last_reading: 'Last reading',
        voltage_max_min: 'Voltage max / min',
        current_max_min: 'Current max / min',
        soc_average: 'SOC average',
        soc_max_min: 'SOC max / min',
        export_csv: 'Export CSV',
        clear_history: 'Clear history',
        // Inspector
        hex_dump_title: 'Hex dump · packet 0x03',
        clear_btn: 'Clear',
        candidates_title: 'Candidates (all offsets)',
        waiting_packets: 'Connect and wait for a packet...',
        log_title: 'Log',
        // install hint
        install_hint: 'Tip: Tap ⋮ and select "Add to Home Screen" to use as a native app.',
        // toasts
        toast_connected: 'Connected to ',
        toast_auto_connected: 'Auto-connected',
        toast_history_updated: 'History updated',
        toast_data_updated: 'Data updated',
        toast_export_none: 'No data to export',
        toast_exported: 'Exported ',
        toast_history_cleared: 'History cleared',
        toast_already_installed: 'App already installed or cannot be installed here',
        toast_install_success: 'App installed successfully',
        toast_install_choice: 'Install choice: ',
        // confirm
        confirm_clear_history: 'Delete ALL stored history? This cannot be undone.',
        // PWA install
        install_app: 'Install app',
        pwa_available: 'App installable',
    },
    es: {
        // Header / nav
        header_subtitle: 'Monitor BLE · Persistencia · Historial',
        nav_dashboard: 'Dashboard', nav_history: 'Historial', nav_inspector: 'Inspector',
        live_badge: 'EN VIVO',
        // Connection card
        status_disconnected: 'Desconectado',
        badge_ble: 'BLE',
        connect_btn: 'Conectar batería SAKO',
        reconnect_btn: 'Reconexión rápida',
        disconnect_btn: 'Desconectar',
        connecting_status: 'Conectando...',
        connected_to: 'Conectado a ',
        auto_reconnected: 'Reconectado automáticamente',
        connected_remember: 'Conectado. Se recordará para la próxima vez.',
        ble_not_available: 'Web Bluetooth no disponible. Usa Chrome/Edge/Samsung Internet.',
        ble_expired: 'Permisos BLE expirados. Usa "Reconexión rápida".',
        ble_nosupport: 'Autoconexión no soportada. Usa "Reconexión rápida".',
        searching: 'Buscando ',
        reconnect_fail: 'Reconexión fallida: ',
        gatt_connected: 'GATT conectado',
        connection_error: 'Connection error: ',
        requesting_device: 'Solicitando dispositivo BLE…',
        requesting: 'Solicitando…',
        // Dashboard
        time_remaining: 'Tiempo restante',
        time_charging: 'Tiempo restante (carga)',
        time_discharging: 'Tiempo restante (descarga)',
        time_idle: 'Inactivo',
        no_significant_current: 'Sin corriente significativa',
        // BMS status
        fet_charge_on: 'ON', fet_charge_off: 'OFF',
        fet_discharge_on: 'ON', fet_discharge_off: 'OFF',
        balance_active: 'Activo', balance_inactive: 'Inactivo',
        last_packet: 'Último paquete',
        // Stats labels
        stat_voltage: 'Voltaje', stat_current: 'Corriente', stat_power: 'Potencia',
        stat_cap_rem: 'Cap. rest.', stat_cap_tot: 'Cap. total',
        stat_cycles: 'Ciclos', stat_cells: 'Celdas',
        stat_sw: 'Versión SW', stat_protection: 'Protección',
        // Temperatures
        ntc_label: 'NTC ', no_sensors: 'Sin sensores',
        // Temps
        temperatures: 'Temperaturas',
        bms_status: 'Estado del BMS',
        // History
        trend_chart: 'Gráfico de tendencias',
        session_stats: 'Estadísticas de sesión',
        stored_readings: 'Lecturas almacenadas',
        first_reading: 'Primera lectura',
        last_reading: 'Última lectura',
        voltage_max_min: 'Voltaje máx. / mín.',
        current_max_min: 'Corriente máx. / mín.',
        soc_average: 'SOC promedio',
        soc_max_min: 'SOC máx. / mín.',
        export_csv: 'Exportar CSV',
        clear_history: 'Borrar historial',
        // Inspector
        hex_dump_title: 'Hex dump · paquete 0x03',
        clear_btn: 'Limpiar',
        candidates_title: 'Candidatos (todos los offsets)',
        waiting_packets: 'Conecta y espera un paquete…',
        log_title: 'Log',
        // install hint
        install_hint: '💡 Consejo: Toca ⋮ y selecciona "Añadir a pantalla de inicio" para usarla como app nativa.',
        // toasts
        toast_connected: 'Conectado a ',
        toast_auto_connected: 'Autoconectado',
        toast_history_updated: 'Historial actualizado',
        toast_data_updated: 'Datos actualizados',
        toast_export_none: 'No data to export',
        toast_exported: 'Exportados ',
        toast_history_cleared: 'Historial borrado',
        toast_already_installed: 'App already installed or cannot be installed here',
        toast_install_success: 'App instalada correctamente',
        toast_install_choice: 'Install choice: ',
        // confirm
        confirm_clear_history: '¿Borrar TODO el historial almacenado? Esta acción no se puede deshacer.',
        // PWA install
        install_app: 'Instalar app',
        pwa_available: 'App instalable',
    }
};

// Detect language: browser navigator.language → localStorage override → default en
const NAV_LANG = (navigator.language || 'en').split('-')[0];
let CURRENT_LANG = localStorage.getItem('sako_lang') ||
    (NAV_LANG === 'es' ? 'es' : 'en');

function L(key) {
    const dict = I18N[CURRENT_LANG] || I18N['en'];
    return dict[key] !== undefined ? dict[key] : I18N['en'][key] || key;
}

function setLang(lang) {
    CURRENT_LANG = lang;
    localStorage.setItem('sako_lang', lang);
    // Re-render all dynamic strings
    applyStrings();
    // Update language toggle button
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
}

function applyStrings() {
    // Header
    $('headerSub').textContent = L('header_subtitle');
    // Nav items
    document.querySelectorAll('[data-i18n-nav]').forEach(el => {
        const key = el.dataset.i18nNav;
        el.textContent = L(key);
    });
    // Connect card
    $('statusText').textContent = $('statusText').textContent.includes('Conectad')
        ? L('connected_to') + ($('statusText').textContent.split('·')[1] || '')
        : ($('statusDot').classList.contains('connected') ? L('connected_to') : L('status_disconnected'));
    $('connBadge').textContent = $('statusDot').classList.contains('connected')
        ? 'LIVE' : L('badge_ble');
    $('connectBtn') && ($('connectBtn').innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> ${L('connect_btn')}`);
    $('reconnectBtn') && ($('reconnectBtn').innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> ${L('reconnect_btn')}`);
    $('disconnectBtn') && ($('disconnectBtn').innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${L('disconnect_btn')}`);
    $('installHint') && ($('installHint').innerHTML = L('install_hint'));
    $('installBtn') && ($('installBtn').innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${L('install_app')}`);
    // Dashboard
    $('dashTimeLabel') && ($('dashTimeLabel').textContent = L('time_remaining'));
    // History
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (key) el.textContent = L(key);
    });
    // Stats
    const statMap = {
        'statCount': 'stored_readings', 'statFirst': 'first_reading',
        'statLast': 'last_reading', 'statVrange': 'voltage_max_min',
        'statIrange': 'current_max_min', 'statSocAvg': 'soc_average',
        'statSOCrange': 'soc_max_min'
    };
    Object.entries(statMap).forEach(([id, key]) => {
        const el = $(id);
        if (el && el.textContent === '—') {} // Don't override dynamic content
    });
}

// ═══════════════════════════════════════════════════════════════
//  First boot: install hint for browsers that suppress beforeinstallprompt
// ═══════════════════════════════════════════════════════════════
if (!localStorage.getItem('sako_hint_shown')) {
    setTimeout(() => { const h = $('installHint'); if (h) h.classList.remove('hidden'); }, 2500);
    localStorage.setItem('sako_hint_shown', '1');
}

        // ═══════════════════════════════════════════════════════════════
        //  CONSTANTS
        // ═══════════════════════════════════════════════════════════════
        const JBD_SERVICE = 0xFF00;
        const JBD_RX      = 0xFF01;
        const JBD_TX      = 0xFF02;
        const CMD_INFO    = new Uint8Array([0xDD,0xA5,0x03,0x00,0xFF,0xFD,0x77]);

        // ═══════════════════════════════════════════════════════════════
        //  STATE
        // ═══════════════════════════════════════════════════════════════
        let device=null, server=null, service=null, rxChar=null, txChar=null;
        let isConnected=false, pollInterval=null;
        let rxBuffer = [];
        let lastPacket03 = null;
        let viewMode = 'dashboard';
        let packetCount = 0;
        let lastDataTime = 0;
        let db = null;
        let chartData = [];
        let recentVoltages = [];

        // ═══════════════════════════════════════════════════════════════
        //  HAPTIC
        // ═══════════════════════════════════════════════════════════════
        function haptic(ms=12) {
            if (navigator.vibrate) navigator.vibrate(ms);
        }

        // ═══════════════════════════════════════════════════════════════
        //  INDEXEDDB
        // ═══════════════════════════════════════════════════════════════
        const DB_NAME = 'SakoBatteryDB';
        const DB_VERSION = 1;

        function openDB() {
            return new Promise((resolve, reject) => {
                const req = indexedDB.open(DB_NAME, DB_VERSION);
                req.onerror = () => reject(req.error);
                req.onsuccess = () => resolve(req.result);
                req.onupgradeneeded = (e) => {
                    const database = e.target.result;
                    if (!database.objectStoreNames.contains('readings')) {
                        const store = database.createObjectStore('readings', { keyPath: 'id', autoIncrement: true });
                        store.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                    if (!database.objectStoreNames.contains('settings')) {
                        database.createObjectStore('settings', { keyPath: 'key' });
                    }
                };
            });
        }

        async function saveSetting(key, value) {
            if (!db) return;
            const tx = db.transaction('settings', 'readwrite');
            const store = tx.objectStore('settings');
            await store.put({ key, value, updated: Date.now() });
        }
        async function getSetting(key, defaultValue = null) {
            if (!db) return defaultValue;
            return new Promise((resolve) => {
                const tx = db.transaction('settings', 'readonly');
                const store = tx.objectStore('settings');
                const req = store.get(key);
                req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
                req.onerror = () => resolve(defaultValue);
            });
        }
        async function saveReading(data) {
            if (!db) return;
            const tx = db.transaction('readings', 'readwrite');
            const store = tx.objectStore('readings');
            await store.add({
                timestamp: Date.now(),
                voltage: data.voltage,
                current: data.current,
                power: data.power,
                soc: data.soc,
                capacityRemaining: data.capacityRemaining,
                capacityTotal: data.capacityTotal,
                cycles: data.cycles,
                temperature: data.temperatures,
                fetStatus: data.fetStatus,
                protStatus: data.protStatus,
                cellCount: data.cellCount
            });
            const countReq = store.count();
            countReq.onsuccess = async () => {
                if (countReq.result > 5000) {
                    const all = await getAllReadings();
                    if (all.length > 5000) {
                        const toDelete = all.slice(0, all.length - 5000);
                        const tx2 = db.transaction('readings', 'readwrite');
                        const s2 = tx2.objectStore('readings');
                        for (const r of toDelete) s2.delete(r.id);
                    }
                }
            };
        }
        async function getAllReadings() {
            if (!db) return [];
            return new Promise((resolve) => {
                const tx = db.transaction('readings', 'readonly');
                const store = tx.objectStore('readings');
                const idx = store.index('timestamp');
                const req = idx.getAll();
                req.onsuccess = () => resolve(req.result || []);
                req.onerror = () => resolve([]);
            });
        }
        async function clearAllReadings() {
            if (!db) return;
            const tx = db.transaction('readings', 'readwrite');
            const store = tx.objectStore('readings');
            await store.clear();
            chartData = [];
            renderChart();
            updateStats();
        }

        // ═══════════════════════════════════════════════════════════════
        //  UTILS
        // ═══════════════════════════════════════════════════════════════
        function $(id){ return document.getElementById(id); }
        function showToast(msg, type='info', d=3000){
            const t=$('toast');
            const icon = type==='success'?'✅':type==='error'?'❌':type==='warn'?'⚠️':'ℹ️';
            $('toastIcon').textContent = icon;
            $('toastText').textContent = msg;
            t.classList.add('show');
            setTimeout(()=>t.classList.remove('show'), d);
        }
        function log(msg, cls=''){
            const c=$('log'); if(!c) return;
            const e=document.createElement('div'); e.className='log-entry '+cls;
            const ts = new Date().toLocaleTimeString('es-ES',{hour12:false});
            e.textContent = '['+ts+'] '+msg;
            c.appendChild(e); c.scrollTop=c.scrollHeight;
            while(c.children.length>120) c.removeChild(c.firstChild);
        }
        function bytesToHex(b){ return Array.from(b).map(x=>x.toString(16).padStart(2,'0').toUpperCase()).join(' '); }
        function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

        // ═══════════════════════════════════════════════════════════════
        //  CHECKSUM
        // ═══════════════════════════════════════════════════════════════
        function calcChecksumStandard(packet, dataLen){
            let sum = packet[1] + packet[2] + packet[3];
            for(let i=4; i<4+dataLen; i++) sum += packet[i];
            return (0x10000 - sum) & 0xFFFF;
        }
        function calcChecksumSako(packet, dataLen){
            let sum = packet[2] + packet[3];
            for(let i=4; i<4+dataLen; i++) sum += packet[i];
            return (0x10000 - sum) & 0xFFFF;
        }
        function verifyChecksum(packet){
            const dataLen = packet[3];
            const csOffset = 4 + dataLen;
            if(packet.length < csOffset + 2) return { ok:false, mode:'short' };
            if(packet[packet.length-1] !== 0x77) return { ok:false, mode:'no-end' };
            const rx = (packet[csOffset]<<8) | packet[csOffset+1];
            const std = calcChecksumStandard(packet, dataLen);
            const sako = calcChecksumSako(packet, dataLen);
            if(rx === std) return { ok:true, mode:'std', rx, std, sako };
            if(rx === sako) return { ok:true, mode:'sako', rx, std, sako };
            return { ok:false, mode:'fail', rx, std, sako };
        }

        // ═══════════════════════════════════════════════════════════════
        //  AUTO-CONNECT
        // ═══════════════════════════════════════════════════════════════
        async function tryAutoConnect() {
            const lastId = await getSetting('lastDeviceId');
            const lastName = await getSetting('lastDeviceName', '');
            const autoConnect = await getSetting('autoConnect', true);

            if (!navigator.bluetooth) {
                $('bleSupportMsg').textContent = '❌ Web Bluetooth no disponible. Usa Chrome/Edge/Samsung Internet.';
                return false;
            }
            if (lastId && lastName) {
                $('reconnectBtn').textContent = '⚡ Reconectar ' + lastName;
                $('reconnectBtn').classList.remove('hidden');
                $('connectBtn').classList.add('hidden');
            }
            if (!lastId || !autoConnect) return false;

            if (navigator.bluetooth.getDevices) {
                try {
                    $('statusDot').classList.add('connecting');
                    $('statusText').textContent = 'Buscando…';
                    $('autoConnectMsg').textContent = '🔍 Buscando ' + lastName + '…';
                    const devices = await navigator.bluetooth.getDevices();
                    const prev = devices.find(d => d.id === lastId);
                    if (prev) {
                        const ok = await doConnect(prev, true);
                        if (ok) return true;
                    }
                } catch (err) {
                    log('getDevices() failed: ' + err.message, 'log-warn');
                }
            }
            $('statusDot').classList.remove('connecting');
            $('statusText').textContent = 'Desconectado';
            if (navigator.bluetooth.getDevices) {
                $('autoConnectMsg').textContent = L('ble_expired');
            } else {
                $('autoConnectMsg').textContent = L('ble_nosupport');
                $('bleSupportMsg').textContent = 'Puede necesitar chrome://flags/#enable-experimental-web-platform-features';
            }
            return false;
        }

        async function quickReconnect() {
            haptic(20);
            const lastName = await getSetting('lastDeviceName', '');
            log('Quick reconnect to: ' + (lastName || 'saved device'));
            try {
                $('connectBtn').disabled = true;
                $('reconnectBtn').disabled = true;
                $('statusDot').classList.add('connecting');
                $('statusText').textContent = L('requesting');
                let dev;
                try {
                    if (lastName && lastName.length > 2) {
                        dev = await navigator.bluetooth.requestDevice({
                            filters: [{ namePrefix: lastName.substring(0, Math.min(8, lastName.length)) }],
                            optionalServices: [JBD_SERVICE]
                        });
                    } else throw new Error('No name');
                } catch (e) {
                    dev = await navigator.bluetooth.requestDevice({
                        acceptAllDevices: true,
                        optionalServices: [JBD_SERVICE]
                    });
                }
                if (dev) {
                    await saveSetting('lastDeviceId', dev.id);
                    await saveSetting('lastDeviceName', dev.name || 'SAKO');
                    await doConnect(dev, false);
                }
            } catch (err) {
                log('Quick reconnect failed: ' + err.message, 'log-err');
                showToast(err.message, 'error');
            } finally {
                $('connectBtn').disabled = false;
                $('reconnectBtn').disabled = false;
                $('statusDot').classList.remove('connecting');
            }
        }

        async function doConnect(dev, isAuto) {
            try {
                device = dev;
                log((isAuto ? 'Autoconectando' : 'Conectando') + ' a: ' + (device.name || 'Sin nombre'));
                device.addEventListener('gattserverdisconnected', onDisconnected);
                server = await device.gatt.connect();
                log('GATT conectado');
                service = await server.getPrimaryService(JBD_SERVICE);
                rxChar = await service.getCharacteristic(JBD_RX);
                await rxChar.startNotifications();
                rxChar.addEventListener('characteristicvaluechanged', handleNotification);
                txChar = await service.getCharacteristic(JBD_TX);
                isConnected = true;

                await saveSetting('lastDeviceId', device.id);
                await saveSetting('lastDeviceName', device.name || 'SAKO');
                await saveSetting('autoConnect', true);

                $('statusDot').classList.remove('connecting');
                $('statusDot').classList.add('connected');
                $('statusText').textContent = 'Conectado · ' + (device.name || 'SAKO');
                $('connBadge').textContent = 'LIVE';
                $('connBadge').className = 'badge badge-charging';
                $('connectBtn').classList.add('hidden');
                $('reconnectBtn').classList.add('hidden');
                $('disconnectBtn').classList.remove('hidden');
                $('liveBadge').classList.remove('hidden');
                $('modeRow') && $('modeRow').classList.remove('hidden');
                $(viewMode==='dashboard'?'viewDashboard': viewMode==='history'?'viewHistory':'viewInspector').classList.remove('hidden');
                $('autoConnectMsg').textContent = isAuto ? L('auto_reconnected') : L('connected_remember');
                $('bleSupportMsg').textContent = '';
                showToast((isAuto ? 'Autoconectado' : 'Conectado') + ' a ' + (device.name || 'BMS'), 'success');
                haptic([30, 50, 30]);

                await sendCmd(CMD_INFO); await sleep(600);
                await sendCmd(CMD_INFO); await sleep(600);
                await sendCmd(CMD_INFO);

                pollInterval = setInterval(()=>{
                    if(isConnected) sendCmd(CMD_INFO);
                }, 4000);
                return true;
            } catch (err) {
                $('statusDot').classList.remove('connecting');
                $('statusText').textContent = 'Desconectado';
                $('autoConnectMsg').textContent = 'Error: ' + err.message;
                log('Connection error: ' + err.message, 'log-err');
                device = null;
                return false;
            }
        }

        // ═══════════════════════════════════════════════════════════════
//  BMS name hints (para auto-detectar en futuras versiones con
//  better-permission-memory; por ahora se usa acceptAllDevices)
// ═══════════════════════════════════════════════════════════════
const JBD_NAME_PREFIXES = ['SAKO', 'BMS', 'BT-', 'Li-ion', 'JK', 'JBD', 'DALY'];

        async function connect(){
            haptic(20);
            log(L('requesting_device'));
            try{
                if(!navigator.bluetooth){ showToast('Use Chrome/Edge on Android/PC', 'warn'); return; }
                $('connectBtn').disabled = true;
                const dev = await navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: [JBD_SERVICE]
                });
                await doConnect(dev, false);
            }catch(err){
                log('Error: '+err.message, 'log-err');
                showToast(err.message, 'error');
            }finally{
                $('connectBtn').disabled = false;
            }
        }

        async function sendCmd(cmd){
            if(!txChar) return;
            try{ await txChar.writeValueWithoutResponse(cmd); }
            catch(e){ try{ await txChar.writeValue(cmd); } catch(e2){} }
        }

        async function disconnect(){
            haptic(20);
            isConnected = false;
            if(pollInterval){ clearInterval(pollInterval); pollInterval = null; }
            if(device && device.gatt.connected){
                try{ await device.gatt.disconnect(); }catch(e){}
            }
            await onDisconnected();
        }

        async function onDisconnected(){
            isConnected = false;
            if(pollInterval){ clearInterval(pollInterval); pollInterval = null; }
            $('statusDot').classList.remove('connected');
            $('statusDot').classList.remove('connecting');
            $('statusText').textContent = 'Desconectado';
            $('connBadge').textContent = 'BLE';
            $('connBadge').className = 'badge badge-idle';
            $('connectBtn').classList.remove('hidden');
            $('connectBtn').disabled = false;
            $('disconnectBtn').classList.add('hidden');
            $('liveBadge').classList.add('hidden');
            $('viewDashboard').classList.add('hidden');
            $('viewHistory').classList.add('hidden');
            $('viewInspector').classList.add('hidden');
            device = server = service = rxChar = txChar = null;
            rxBuffer = [];
            $('autoConnectMsg').textContent = '';
            $('bleSupportMsg').textContent = '';
            const lastName = await getSetting('lastDeviceName', '');
            if (lastName) {
                $('reconnectBtn').textContent = '⚡ Reconectar ' + lastName;
                $('reconnectBtn').classList.remove('hidden');
                $('connectBtn').classList.add('hidden');
            }
        }

        function setMode(mode){
            haptic(8);
            viewMode = mode;
            // Update nav
            document.querySelectorAll('.nav-item').forEach(el => {
                el.classList.toggle('active', el.dataset.mode === mode);
            });
            // Move indicator
            const activeBtn = document.querySelector('.nav-item[data-mode="'+mode+'"]');
            if (activeBtn) {
                const nav = $('bottomNav');
                const indicator = $('navIndicator');
                const rect = activeBtn.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();
                indicator.style.left = (rect.left - navRect.left + rect.width/2 - 20) + 'px';
            }
            // Switch views
            $('viewDashboard').classList.toggle('hidden', mode!=='dashboard');
            $('viewHistory').classList.toggle('hidden', mode!=='history');
            $('viewInspector').classList.toggle('hidden', mode!=='inspector');
            if (mode === 'history') loadChartData();
        }

        function clearPackets(){
            haptic(8);
            lastPacket03 = null;
            $('hexDump').innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="1.5" style="margin-bottom:10px"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg><br/>Conecta y espera un paquete…';
            $('candidateBody').innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--muted);padding:30px 20px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="1.5" style="margin-bottom:8px"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><br/>Esperando paquetes…</td></tr>';
        }

        // ═══════════════════════════════════════════════════════════════
        //  BLE HANDLER
        // ═══════════════════════════════════════════════════════════════
        function handleNotification(event){
            const value = event.target.value;
            const bytes = new Uint8Array(value.buffer);
            for(let i=0;i<bytes.length;i++) rxBuffer.push(bytes[i]);
            parseBuffer();
        }

        function parseBuffer(){
            while(rxBuffer.length >= 7){
                const startIdx = rxBuffer.indexOf(0xDD);
                if(startIdx === -1){ rxBuffer = []; break; }
                if(rxBuffer.length < startIdx + 7) break;
                const resp = rxBuffer[startIdx + 1];
                const status = rxBuffer[startIdx + 2];
                const dataLen = rxBuffer[startIdx + 3];
                const totalLen = dataLen + 7;
                if(rxBuffer.length < startIdx + totalLen) break;
                if(rxBuffer[startIdx + totalLen - 1] !== 0x77){
                    log('Bad end byte, skipping…', 'log-warn');
                    rxBuffer = rxBuffer.slice(startIdx + 1);
                    continue;
                }
                const packet = new Uint8Array(rxBuffer.slice(startIdx, startIdx + totalLen));
                rxBuffer = rxBuffer.slice(startIdx + totalLen);
                const cs = verifyChecksum(packet);
                const csOffset = 4 + dataLen;
                const csRx = (packet[csOffset]<<8)|packet[csOffset+1];
                log('PKT #'+(++packetCount)+' '+totalLen+'B  resp=0x'+resp.toString(16).padStart(2,'0')+
                    '  len='+dataLen+'  CS='+(cs.ok?cs.mode.toUpperCase()+' OK':'FAIL')+
                    '  rx='+csRx.toString(16).toUpperCase().padStart(4,'0'),
                    cs.ok?'log-ok':'log-err');
                if(!cs.ok) continue;
                if(status !== 0x00){ log('BMS error 0x'+status.toString(16).padStart(2,'0'), 'log-err'); continue; }
                if(resp === 0x03){
                    lastPacket03 = packet;
                    lastDataTime = Date.now();
                    const data = packet.slice(4, 4 + dataLen);
                    parseJBD03(data, dataLen);
                    if(viewMode === 'inspector') inspectPacket(packet, dataLen);
                }
            }
            if(rxBuffer.length > 600) rxBuffer = rxBuffer.slice(-250);
        }

        // ═══════════════════════════════════════════════════════════════
        //  JBD PARSER
        // ═══════════════════════════════════════════════════════════════
        function parseJBD03(data, dataLen){
            if(dataLen < 20) { log('Datos 0x03 muy cortos ('+dataLen+')', 'log-warn'); return; }
            const u16be = (o)=> (data[o]<<8)|data[o+1];
            const i16be = (o)=> { const v=(data[o]<<8)|data[o+1]; return v>32767?v-65536:v; };
            const kelvinToC = (o)=> { const v=u16be(o); return v===0?null:((v/10)-273.15).toFixed(1); };

            const voltage = (u16be(0)/100).toFixed(2);
            const current = (i16be(2)/100).toFixed(2);
            const capRem = (u16be(4)/100).toFixed(2);
            const capTot = (u16be(6)/100).toFixed(2);
            const cycles = u16be(8);
            const balLow = u16be(12);
            const balHigh = u16be(14);
            const protStatus = data[16];
            const swVersion = data[17];
            const socByte = data[18];
            const fetStatus = data[19];
            const cellCount = dataLen > 20 ? data[20] : 0;
            const ntcBytes = dataLen > 21 ? data[21] : 0;

            const temps = [];
            const ntcCount = Math.floor(ntcBytes / 2);
            for(let i=0; i<ntcCount; i++){
                const off = 22 + i*2;
                if(off+1 < dataLen){
                    const t = kelvinToC(off);
                    if(t !== null) temps.push(parseFloat(t));
                }
            }

            const capRemNum = parseFloat(capRem);
            const capTotNum = parseFloat(capTot);
            let soc = capTotNum > 0 ? Math.round((capRemNum / capTotNum) * 100) : socByte;
            if(soc < 0) soc = 0; if(soc > 100) soc = 100;

            const power = (parseFloat(voltage) * parseFloat(current)).toFixed(0);
            const isCharging = parseFloat(current) > 0.5;
            const isDischarging = parseFloat(current) < -0.5;
            const curAbs = Math.abs(parseFloat(current));

            // Sparkline
            recentVoltages.push(parseFloat(voltage));
            if (recentVoltages.length > 40) recentVoltages.shift();
            renderSparkline();

            // Time calc
            let timeLabel = 'Inactivo', timeVal = '—', timeSub = '', progressPct = soc, progressColor = 'var(--dim)';
            if(isCharging && curAbs > 0.5){
                const ahNeed = capTotNum - capRemNum;
                const hours = ahNeed / curAbs;
                timeLabel = 'Tiempo restante (carga)'; timeVal = fmtTime(hours);
                timeSub = ahNeed.toFixed(1) + ' Ah × ' + curAbs.toFixed(1) + ' A';
                progressColor = 'var(--success)';
            }else if(isDischarging && curAbs > 0.5){
                const hours = capRemNum / curAbs;
                timeLabel = 'Tiempo restante (descarga)'; timeVal = fmtTime(hours);
                timeSub = capRemNum.toFixed(1) + ' Ah ÷ ' + curAbs.toFixed(1) + ' A';
                progressColor = 'var(--info)';
            }else{
                timeSub = 'Sin corriente significativa';
            }

            // Dashboard
            $('dashSoc').textContent = soc+'%';
            const circ = 2 * Math.PI * 82;
            $('ringFill').style.strokeDashoffset = circ * (1 - soc/100);
            $('ringFill').style.stroke = isCharging ? 'var(--success)' : isDischarging ? 'var(--info)' : 'var(--dim)';
            $('dashCapLabel').textContent = capTotNum > 0 ? capTotNum.toFixed(0) + ' Ah' : '320 Ah';

            $('dashV').textContent = voltage;
            $('dashI').textContent = (parseFloat(current)>0?'+':'')+current;
            $('dashP').textContent = (parseFloat(power)>0?'+':'')+power;
            $('dashCapRem').textContent = capRem;
            $('dashCapTot').textContent = capTot;
            $('dashCyc').textContent = cycles;
            $('dashCells').textContent = cellCount ? cellCount+'S' : '—';
            $('dashVer').textContent = swVersion ? (swVersion/10).toFixed(1) : '—';
            $('dashProt').textContent = protStatus===0 ? 'OK' : '0x'+protStatus.toString(16).toUpperCase();
            $('dashProt').style.color = protStatus===0 ? 'var(--success)' : 'var(--danger)';

            $('dashTimeLabel').textContent = timeLabel;
            $('dashTime').textContent = timeVal;
            $('dashTimeSub').textContent = timeSub;
            $('timeProgress').style.width = progressPct+'%';
            $('timeProgress').style.background = progressColor;

            const badge = $('connBadge');
            if(isCharging){ badge.textContent='CARGANDO'; badge.className='badge badge-charging'; }
            else if(isDischarging){ badge.textContent='DESCARGANDO'; badge.className='badge badge-discharging'; }
            else { badge.textContent='IDLE'; badge.className='badge badge-idle'; }

            $('dashFetChg').innerHTML = (fetStatus & 0x01) ? '<span class="bms-tag" style="background:rgba(34,197,94,0.15);color:var(--success)">ON</span>' : '<span class="bms-tag" style="background:rgba(239,68,68,0.15);color:var(--danger)">OFF</span>';
            $('dashFetDsc').innerHTML = (fetStatus & 0x02) ? '<span class="bms-tag" style="background:rgba(34,197,94,0.15);color:var(--success)">ON</span>' : '<span class="bms-tag" style="background:rgba(239,68,68,0.15);color:var(--danger)">OFF</span>';
            const balActive = (balLow !== 0 || balHigh !== 0);
            $('dashBal').innerHTML = balActive ? '<span class="bms-tag" style="background:rgba(245,158,11,0.15);color:var(--warning)">Activo</span>' : '<span style="color:var(--dim)">Inactivo</span>';
            $('dashLast').textContent = new Date().toLocaleTimeString('es-ES',{hour12:false});

            const tg = $('tempGrid');
            tg.innerHTML = '';
            if(temps.length === 0){
                tg.innerHTML = '<div class="temp-item" style="grid-column:1/-1;"><span>Sin sensores</span>—</div>';
            }else{
                temps.forEach((t,i)=>{
                    const div = document.createElement('div');
                    div.className = 'temp-item';
                    div.innerHTML = '<span>NTC '+(i+1)+'</span>'+t.toFixed(1)+'°C';
                    tg.appendChild(div);
                });
            }

            saveReading({
                voltage: parseFloat(voltage), current: parseFloat(current), power: parseFloat(power),
                soc: soc, capacityRemaining: capRemNum, capacityTotal: capTotNum, cycles: cycles,
                temperatures: temps, fetStatus: fetStatus, protStatus: protStatus, cellCount: cellCount
            });
        }

        function fmtTime(hours){
            if(!isFinite(hours)||hours<=0) return '—';
            const d=Math.floor(hours/24), h=Math.floor(hours%24), m=Math.floor((hours%1)*60);
            if(d>0) return `${d}d ${h}h ${m}m`;
            if(h>0) return `${h}h ${m}m`;
            return `${m} min`;
        }

        // ═══════════════════════════════════════════════════════════════
        //  SPARKLINE
        // ═══════════════════════════════════════════════════════════════
        function renderSparkline() {
            if (recentVoltages.length < 3) { $('sparkWrap').classList.add('hidden'); return; }
            $('sparkWrap').classList.remove('hidden');
            const svg = $('sparkSvg');
            const path = $('sparkPath');
            const area = $('sparkArea');
            const W = 300, H = 40;
            const minV = Math.min(...recentVoltages) - 0.1;
            const maxV = Math.max(...recentVoltages) + 0.1;
            const range = maxV - minV || 1;
            let d = '';
            recentVoltages.forEach((v, i) => {
                const x = (i / (recentVoltages.length - 1)) * W;
                const y = H - ((v - minV) / range) * H;
                d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
            });
            path.setAttribute('d', d);
            area.setAttribute('d', d + 'L' + W + ',' + H + ' L0,' + H + ' Z');
        }

        // ═══════════════════════════════════════════════════════════════
        //  HISTORY / CHARTS
        // ═══════════════════════════════════════════════════════════════
        async function loadChartData() {
            chartData = await getAllReadings();
            renderChart();
            updateStats();
        }

        function renderChart() {
            const svg = $('chartSvg');
            const grid = $('chartGrid');
            const labels = $('chartLabels');
            const pathV = $('pathV');
            const pathI = $('pathI');
            const pathSOC = $('pathSOC');
            const areaV = $('areaV');
            const areaI = $('areaI');
            const areaSOC = $('areaSOC');
            const pointsV = $('pointsV');
            const pointsI = $('pointsI');
            const pointsSOC = $('pointsSOC');
            const zeroLine = $('zeroLine');

            if (chartData.length < 2) {
                grid.innerHTML = ''; labels.innerHTML = '';
                pathV.setAttribute('d', ''); pathI.setAttribute('d', ''); pathSOC.setAttribute('d', '');
                areaV.setAttribute('d', ''); areaI.setAttribute('d', ''); areaSOC.setAttribute('d', '');
                pointsV.innerHTML = ''; pointsI.innerHTML = ''; pointsSOC.innerHTML = '';
                zeroLine.setAttribute('x1',0); zeroLine.setAttribute('y1',0);
                zeroLine.setAttribute('x2',0); zeroLine.setAttribute('y2',0);
                return;
            }

            const W = 640, H = 220;
            const margin = { top: 16, right: 50, bottom: 26, left: 50 };
            const w = W - margin.left - margin.right;
            const h = H - margin.top - margin.bottom;
            const data = chartData.slice(-120);
            const minT = data[0].timestamp;
            const maxT = data[data.length - 1].timestamp;
            const timeRange = maxT - minT || 1;

            const volts = data.map(d => d.voltage);
            const curs = data.map(d => d.current);
            const socs = data.map(d => d.soc);

            let minV = Math.min(...volts) - 0.3;
            let maxV = Math.max(...volts) + 0.3;
            if (maxV - minV < 0.5) { const mid = (minV + maxV) / 2; minV = mid - 0.25; maxV = mid + 0.25; }
            const vRange = (maxV - minV) || 1;

            let minI = Math.min(...curs);
            let maxI = Math.max(...curs);
            const iPad = Math.max(1, (maxI - minI) * 0.1);
            minI -= iPad; maxI += iPad;
            if (maxI - minI < 2) { const mid = (minI + maxI) / 2; minI = mid - 1; maxI = mid + 1; }
            const iRange = (maxI - minI) || 1;

            const minSOC = 0, maxSOC = 100;

            const xOf = (t) => margin.left + ((t - minT) / timeRange) * w;
            const yV = (v) => margin.top + h - ((v - minV) / vRange) * h;
            const yI = (i) => margin.top + h - ((i - minI) / iRange) * h;
            const ySOC = (s) => margin.top + h - ((s - minSOC) / (maxSOC - minSOC)) * h;

            let gridHtml = '', labelHtml = '';
            for (let i = 0; i <= 4; i++) {
                const y = margin.top + (h * i / 4);
                gridHtml += `<line x1="${margin.left}" y1="${y}" x2="${margin.left + w}" y2="${y}"/>`;
                const vVal = maxV - (vRange * i / 4);
                labelHtml += `<text x="${margin.left - 8}" y="${y + 3}" text-anchor="end" fill="var(--success)" font-size="9" font-weight="600">${vVal.toFixed(1)}</text>`;
                const iVal = maxI - (iRange * i / 4);
                labelHtml += `<text x="${margin.left + w + 8}" y="${y + 3}" text-anchor="start" fill="var(--info)" font-size="9" font-weight="600">${iVal.toFixed(1)}</text>`;
            }
            const timeSteps = 4;
            for (let i = 0; i <= timeSteps; i++) {
                const x = margin.left + (w * i / timeSteps);
                const t = minT + (timeRange * i / timeSteps);
                const timeStr = new Date(t).toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit', hour12:false});
                labelHtml += `<text x="${x}" y="${H - 5}" text-anchor="middle" fill="var(--dim)" font-size="8">${timeStr}</text>`;
            }
            grid.innerHTML = gridHtml;
            labels.innerHTML = labelHtml;

            if (minI <= 0 && maxI >= 0) {
                const zy = yI(0);
                zeroLine.setAttribute('x1', margin.left);
                zeroLine.setAttribute('y1', zy);
                zeroLine.setAttribute('x2', margin.left + w);
                zeroLine.setAttribute('y2', zy);
            } else {
                zeroLine.setAttribute('x1',0); zeroLine.setAttribute('y1',0);
                zeroLine.setAttribute('x2',0); zeroLine.setAttribute('y2',0);
            }

            let dV = '', dI = '', dSOC = '';
            const ptsV = [], ptsI = [], ptsSOC = [];
            data.forEach((d, i) => {
                const x = xOf(d.timestamp);
                const yv = yV(d.voltage);
                const yi = yI(d.current);
                const ys = ySOC(d.soc);
                const cmd = i === 0 ? 'M' : 'L';
                dV += `${cmd}${x.toFixed(1)},${yv.toFixed(1)} `;
                dI += `${cmd}${x.toFixed(1)},${yi.toFixed(1)} `;
                dSOC += `${cmd}${x.toFixed(1)},${ys.toFixed(1)} `;
                ptsV.push({x, y: yv, data: d});
                ptsI.push({x, y: yi, data: d});
                ptsSOC.push({x, y: ys, data: d});
            });

            const aV = dV + `L${margin.left + w},${margin.top + h} L${margin.left},${margin.top + h} Z`;
            const aI = dI + `L${margin.left + w},${margin.top + h} L${margin.left},${margin.top + h} Z`;
            const aSOC = dSOC + `L${margin.left + w},${margin.top + h} L${margin.left},${margin.top + h} Z`;

            pathV.setAttribute('d', dV);
            pathI.setAttribute('d', dI);
            pathSOC.setAttribute('d', dSOC);
            areaV.setAttribute('d', aV);
            areaI.setAttribute('d', aI);
            areaSOC.setAttribute('d', aSOC);

            const step = Math.max(1, Math.floor(ptsV.length / 25));
            let pvHtml = '', piHtml = '', psHtml = '';
            for (let i = 0; i < ptsV.length; i += step) {
                pvHtml += `<circle cx="${ptsV[i].x.toFixed(1)}" cy="${ptsV[i].y.toFixed(1)}" r="2.5" fill="var(--success)" opacity="0.85"/>`;
                piHtml += `<circle cx="${ptsI[i].x.toFixed(1)}" cy="${ptsI[i].y.toFixed(1)}" r="2.5" fill="var(--info)" opacity="0.85"/>`;
                psHtml += `<circle cx="${ptsSOC[i].x.toFixed(1)}" cy="${ptsSOC[i].y.toFixed(1)}" r="1.5" fill="#a78bfa" opacity="0.7"/>`;
            }
            pointsV.innerHTML = pvHtml;
            pointsI.innerHTML = piHtml;
            pointsSOC.innerHTML = psHtml;

            const tooltip = $('chartTooltip');
            svg.onmousemove = (e) => {
                const rect = svg.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (W / rect.width);
                let closest = null, minDist = Infinity;
                for (const p of ptsV) {
                    const dist = Math.abs(p.x - mx);
                    if (dist < minDist) { minDist = dist; closest = p; }
                }
                if (closest && minDist < 35) {
                    const d = closest.data;
                    const date = new Date(d.timestamp).toLocaleTimeString('es-ES', {hour12:false, second:'2-digit'});
                    tooltip.innerHTML = `
                        <div style="font-size:.62rem;color:var(--muted);margin-bottom:3px;font-weight:600;">${date}</div>
                        <div style="color:var(--success);font-weight:700;">⚡ ${d.voltage.toFixed(2)} V</div>
                        <div style="color:var(--info);font-weight:700;">🔌 ${d.current > 0 ? '+' : ''}${d.current.toFixed(2)} A</div>
                        <div style="color:#a78bfa;font-weight:700;">🔋 ${d.soc}%</div>
                        <div style="font-size:.6rem;color:var(--dim);margin-top:3px;">${d.power.toFixed(0)} W · ${d.cycles} ciclos</div>
                    `;
                    tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
                    tooltip.style.top = (e.clientY - rect.top - 55) + 'px';
                    tooltip.style.opacity = '1';
                } else {
                    tooltip.style.opacity = '0';
                }
            };
            svg.onmouseleave = () => { tooltip.style.opacity = '0'; };
        }

        async function updateStats() {
            const data = await getAllReadings();
            $('statCount').textContent = data.length.toLocaleString('es-ES');
            if (data.length === 0) {
                $('statFirst').textContent = '—';
                $('statLast').textContent = '—';
                $('statVrange').textContent = '—';
                $('statIrange').textContent = '—';
                $('statSocAvg').textContent = '—';
                $('statSOCrange').textContent = '—';
                return;
            }
            const volts = data.map(d => d.voltage);
            const curs = data.map(d => d.current);
            const socs = data.map(d => d.soc);
            $('statFirst').textContent = new Date(data[0].timestamp).toLocaleString('es-ES', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
            $('statLast').textContent = new Date(data[data.length-1].timestamp).toLocaleString('es-ES', {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'});
            $('statVrange').textContent = Math.min(...volts).toFixed(2) + ' / ' + Math.max(...volts).toFixed(2) + ' V';
            $('statIrange').textContent = Math.min(...curs).toFixed(2) + ' / ' + Math.max(...curs).toFixed(2) + ' A';
            $('statSocAvg').textContent = (socs.reduce((a,b)=>a+b,0)/socs.length).toFixed(1) + '%';
            $('statSOCrange').textContent = Math.min(...socs) + '% / ' + Math.max(...socs) + '%';
        }

        async function exportCSV() {
            haptic(15);
            const data = await getAllReadings();
            if (data.length === 0) { showToast('No data to export', 'warn'); return; }
            let csv = 'timestamp,voltage,current,power,soc,capacity_remaining,capacity_total,cycles,temperatures\n';
            for (const d of data) {
                csv += `${new Date(d.timestamp).toISOString()},${d.voltage},${d.current},${d.power},${d.soc},${d.capacityRemaining},${d.capacityTotal},${d.cycles},"${(d.temperature||[]).join(';')}"\n`;
            }
            const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sako_battery_${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`Exportados ${data.length.toLocaleString('es-ES')} registros`, 'success');
            log('Exportados '+data.length+' registros a CSV', 'log-info');
        }

        async function clearHistory() {
            haptic([20, 30, 20]);
            if (!confirm(L('confirm_clear_history'))) return;
            await clearAllReadings();
            showToast('Historial borrado', 'success');
            log('History cleared by user', 'log-warn');
        }

        // ═══════════════════════════════════════════════════════════════
        //  INSPECTOR
        // ═══════════════════════════════════════════════════════════════
        function inspectPacket(packet, dataLen){
            const data = packet.slice(4, 4+dataLen);
            let html = '<div class="hex-grid">';
            html += '<div class="hex-cell hdr">Off</div>';
            for(let i=0;i<8;i++) html += '<div class="hex-cell hdr">+'+i+'</div>';
            for(let row=0; row<Math.ceil(data.length/8); row++){
                html += '<div class="hex-cell off">'+String(row*8).padStart(2,'0')+'</div>';
                for(let col=0; col<8; col++){
                    const idx = row*8+col;
                    if(idx < data.length){
                        let cls = 'hex-cell data';
                        if(idx===0||idx===1) cls='hex-cell hl-v';
                        else if(idx===2||idx===3) cls='hex-cell hl-i';
                        else if(idx===4||idx===5) cls='hex-cell hl-c';
                        else if(idx===6||idx===7) cls='hex-cell hl-c';
                        else if(idx===8||idx===9) cls='hex-cell hl-cyc';
                        else if(idx===18) cls='hex-cell hl-soc';
                        else if(idx>=22) cls='hex-cell hl-t';
                        html += '<div class="'+cls+'">'+data[idx].toString(16).padStart(2,'0').toUpperCase()+'</div>';
                    } else html += '<div class="hex-cell">--</div>';
                }
            }
            html += '</div>';
            $('hexDump').innerHTML = html;

            let tbody = '';
            for(let i=0; i<data.length; i++){
                const b = data[i];
                const be16 = (i+1<data.length) ? ((data[i]<<8)|data[i+1]) : null;
                const le16 = (i+1<data.length) ? ((data[i+1]<<8)|data[i]) : null;
                const be16s = (i+1<data.length) ? (be16>32767?be16-65536:be16) : null;
                const le16s = (i+1<data.length) ? (le16>32767?le16-65536:le16) : null;
                const tempK = (i+1<data.length) ? ((be16/10)-273.15).toFixed(1) : null;
                let guess = '';
                if(i===0||i===1) guess = 'Voltaje total (uint16/100)';
                else if(i===2||i===3) guess = 'Corriente (int16/100)';
                else if(i===4||i===5) guess = 'Cap. restante (uint16/100)';
                else if(i===6||i===7) guess = 'Cap. nominal (uint16/100)';
                else if(i===8||i===9) guess = 'Ciclos (uint16)';
                else if(i===10||i===11) guess = 'Production date';
                else if(i===12||i===13) guess = 'Balance status low';
                else if(i===14||i===15) guess = 'Balance status high';
                else if(i===16) guess = 'Protection status (u8)';
                else if(i===17) guess = 'SW version (u8)';
                else if(i===18) guess = 'RSOC % (u8)';
                else if(i===19) guess = 'FET status (u8)';
                else if(i===20) guess = 'Cell count (u8)';
                else if(i===21) guess = 'NTC bytes (u8)';
                else if(i>=22) guess = 'Temp'+(Math.floor((i-22)/2)+1)+' (K/10→°C)';
                let mc = '';
                if(be16!==null){
                    const v = be16/100;
                    if(Math.abs(v-55.0)<5 || Math.abs(v-13.0)<2) mc='match-exact';
                    else if(Math.abs(v-320)<10) mc='match-exact';
                    else if(be16>=2500&&be16<=3500) mc='match-near';
                }
                tbody += '<tr>';
                tbody += '<td>'+String(i).padStart(2,'0')+'</td>';
                tbody += '<td style="font-family:monospace;font-weight:700;">'+b.toString(16).padStart(2,'0').toUpperCase()+'</td>';
                tbody += '<td>'+b+'</td>';
                tbody += '<td class="'+mc+'">'+(be16!==null?(be16/100).toFixed(2):'—')+'</td>';
                tbody += '<td>'+(le16!==null?(le16/100).toFixed(2):'—')+'</td>';
                tbody += '<td>'+(be16s!==null?(be16s/100).toFixed(2):'—')+'</td>';
                tbody += '<td>'+(le16s!==null?(le16s/100).toFixed(2):'—')+'</td>';
                tbody += '<td>'+(tempK!==null?tempK+'°C':'—')+'</td>';
                tbody += '<td style="color:var(--muted);font-size:.68rem;">'+guess+'</td>';
                tbody += '</tr>';
            }
            $('candidateBody').innerHTML = tbody;
        }

        // ═══════════════════════════════════════════════════════════════
        //  PULL TO REFRESH (robusto)
        // ═══════════════════════════════════════════════════════════════
        let ptrStartY = 0, ptrPulling = false, ptrTriggered = false;

        function getScrollTop() {
            return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        }

        document.addEventListener('touchstart', e => {
            ptrStartY = e.touches[0].clientY;
            ptrPulling = getScrollTop() <= 1;
            ptrTriggered = false;
        }, {passive:true});

        document.addEventListener('touchmove', e => {
            if (!ptrPulling) return;
            const dy = e.touches[0].clientY - ptrStartY;
            if (dy > 0 && getScrollTop() <= 1) {
                // Mostrar indicador progresivamente
                const progress = Math.min(dy / 70, 1);
                const indicator = $('ptrIndicator');
                indicator.style.top = (-50 + (progress * 66)) + 'px';
                indicator.style.opacity = progress;
                indicator.querySelector('.ptr-spinner').style.transform = 'rotate(' + (progress * 360) + 'deg)';
                if (dy > 70 && !ptrTriggered) {
                    ptrTriggered = true;
                    haptic(15);
                }
                // Prevenir rubber-banding del navegador
                if (dy > 20) {
                    e.preventDefault();
                }
            }
        }, {passive:false});

        document.addEventListener('touchend', async () => {
            const indicator = $('ptrIndicator');
            indicator.style.top = '-50px';
            indicator.style.opacity = '0';
            indicator.querySelector('.ptr-spinner').style.transform = 'rotate(0deg)';

            if (ptrTriggered) {
                indicator.classList.add('visible');
                indicator.style.top = '16px';
                indicator.style.opacity = '1';
                indicator.querySelector('.ptr-spinner').style.animation = 'spin .6s linear infinite';

                if (viewMode === 'history') {
                    await loadChartData();
                    showToast('Historial actualizado', 'success');
                } else if (isConnected) {
                    await sendCmd(CMD_INFO);
                    showToast('Datos actualizados', 'success');
                } else {
                    showToast('Swipe down in History to sync', 'info');
                }

                setTimeout(() => {
                    indicator.classList.remove('visible');
                    indicator.style.top = '-50px';
                    indicator.style.opacity = '0';
                    indicator.querySelector('.ptr-spinner').style.animation = '';
                }, 800);
            }
            ptrPulling = false;
            ptrTriggered = false;
        });

        // ═══════════════════════════════════════════════════════════════
        //  INIT
        // ═══════════════════════════════════════════════════════════════
        async function init() {
            try {
                db = await openDB();
                log('IndexedDB initialized');
            } catch(e) {
                log('IndexedDB error: ' + e.message, 'log-err');
            }
            // Position nav indicator
            const activeBtn = document.querySelector('.nav-item[data-mode="dashboard"]');
            if (activeBtn) {
                const nav = $('bottomNav');
                const indicator = $('navIndicator');
                const rect = activeBtn.getBoundingClientRect();
                const navRect = nav.getBoundingClientRect();
                indicator.style.left = (rect.left - navRect.left + rect.width/2 - 20) + 'px';
            }
            // Apply language strings on first load
            applyStrings();
            // Activate lang toggle button for current language
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.lang === CURRENT_LANG);
            });
            setTimeout(async () => {
                const connected = await tryAutoConnect();
                if (!connected) {
                    log('SAKO Battery Pro v1.0.0 · PWA Ready');
                    log('Press "Connect" and select your SAKO battery');
                }
            }, 600);
        }

        init();

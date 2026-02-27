//#######################################################################
// WEBSITE https://floworkos.com
// File NAME : C:\Users\User\Music\web\public\store\fake-name-generator\logic.js total lines 229 
//#1. Dynamic Component Discovery (DCD): Hub wajib melakukan scanning file secara otomatis.
//#2. Lazy Loading: Modul hanya di-import ke RAM saat dipanggil (On-Demand).
//#3. Atomic Isolation: 1 File = 1 Fungsi dengan nama file yang identik dengan nama fungsi aslinya.
//#4. Zero Logic Mutation: Dilarang merubah alur logika, nama variabel, atau struktur if/try/loop.
//#######################################################################

module.exports = {
    state: {
        tab: 'info',
        region: 'us',
        gender: 'male',
        identity: {},
        avatar: ''
    },
    sys: null,

    db: {
        global: {
            zodiacs: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
            bloodTypes: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            colors: ["Green", "Blue", "Red", "Black", "Silver", "White", "Crimson", "Navy"],
            vehicles: ["2007 Hummer H2", "2015 Toyota Camry", "2020 Ford F-150", "2019 Honda Civic", "2012 Jeep Wrangler", "2022 Tesla Model 3"],
            companies: ["Ransohoffs", "Globex Corp", "Initech", "Umbrella Corporation", "Acme Corp", "Soylent", "Stark Industries"],
            uas: [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
                "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0"
            ]
        },
        id: {
            firstM: ["Budi", "Agus", "Reza", "Dimas", "Eko", "Fajar", "Gilang", "Hendra"],
            firstF: ["Siti", "Ayu", "Dewi", "Putri", "Rina", "Tari", "Wulan", "Yulia"],
            last: ["Santoso", "Wijaya", "Saputra", "Hidayat", "Pratama", "Nugroho", "Kusuma", "Sari"],
            streets: ["Jl. Sudirman", "Jl. Ahmad Yani", "Jl. Gajah Mada", "Jl. Merdeka", "Jl. Melati"],
            cities: ["Jakarta", "Surabaya", "Bandung", "Medan", "Yogyakarta", "Bali"],
            jobs: ["Software Engineer", "Marketing Staff", "Guru", "PNS", "Wiraswasta", "Desainer Grafis"],
            phoneCode: "62", ssnFormat: "NIK"
        },
        us: {
            firstM: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph"],
            firstF: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica"],
            last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Thorpe"],
            streets: ["Aaron Smith Drive", "Main St", "Broadway", "Wall St", "Sunset Blvd", "Oak St"],
            cities: ["Loysville, PA", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"],
            jobs: ["Limousine driver", "Data Analyst", "Consultant", "Developer", "Sales Rep", "Nurse"],
            phoneCode: "1", ssnFormat: "SSN"
        },
        jp: {
            firstM: ["Hiroshi", "Kenji", "Takeshi", "Yuki", "Daiki", "Ren", "Haruto"],
            firstF: ["Sakura", "Hina", "Yui", "Aoi", "Rin", "Mio", "Nanami"],
            last: ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto"],
            streets: ["Shibuya", "Shinjuku", "Ginza", "Roppongi", "Harajuku"],
            cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo"],
            jobs: ["Office Worker", "Engineer", "Teacher", "Designer", "Chef"],
            phoneCode: "81", ssnFormat: "MyNumber"
        }
    },

    menus: {
        sidebar: [],
        mainDock: [
            { id: 'tab-info', icon: '💡', labelKey: 'home', active: true },
            { id: 'tab-app', icon: '🕵️‍♂️', labelKey: 'tools' }
        ],
        actionDock: []
    },

    mount(sys) {
        this.sys = sys;
        this.bindEvents();
        this.generateIdentity();
        this.updateView();
    },

    unmount() { this.sys.root.innerHTML = ''; },
    find(selector) { return this.sys.root.querySelector(selector); },
    findAll(selector) { return this.sys.root.querySelectorAll(selector); },

    onMenuAction(actionId) {
        if (actionId === 'tab-info') { this.state.tab = 'info'; this.updateView(); }
        if (actionId === 'tab-app') { this.state.tab = 'app'; this.updateView(); }
        if (actionId === 'act-process') { this.generateIdentity(); this.sys.toast('Identitas Ter-Forge!', 'success'); }
        if (actionId === 'act-clear') {
            this.state.identity = {};
            this.state.avatar = '';
            this.renderDOM();
            this.sys.toast(this.sys.t.msgCleared || 'Data Dibakar!', 'danger');
        }
    },

    bindEvents() {
        const ctaBtns = this.findAll('.cta-go-app');
        ctaBtns.forEach(btn => btn.onclick = () => this.onMenuAction('tab-app'));

        const selRegion = this.find('#input-region');
        if (selRegion) {
            selRegion.value = this.state.region;
            selRegion.onchange = (e) => { this.state.region = e.target.value; this.generateIdentity(); };
        }

        const btnMale = this.find('#btn-male');
        const btnFemale = this.find('#btn-female');
        if (btnMale && btnFemale) {
            btnMale.onclick = () => { this.state.gender = 'male'; btnMale.classList.add('active', 'male'); btnFemale.classList.remove('active', 'female'); this.generateIdentity(); };
            btnFemale.onclick = () => { this.state.gender = 'female'; btnFemale.classList.add('active', 'female'); btnMale.classList.remove('active', 'male'); this.generateIdentity(); };
        }

        const copyCards = this.findAll('.copy-trigger');
        copyCards.forEach(card => {
            card.onclick = () => {
                const key = card.getAttribute('data-key');
                if(this.state.identity[key]) {
                    this.sys.copy(this.state.identity[key]);
                }
            };
        });
    },

    rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    randNum(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },

    generateCC() {
        let cc = "5";
        while (cc.length < 15) cc += this.randNum(0, 9);
        let sum = 0, rev = cc.split("").reverse().join("");
        for (let i = 0; i < rev.length; i++) {
            let d = parseInt(rev[i]);
            if (i % 2 == 0) { d *= 2; if (d > 9) d -= 9; }
            sum += d;
        }
        let check = (10 - (sum % 10)) % 10;
        return (cc + check).replace(/(.{4})/g, '$1 ').trim();
    },

    generateIdentity() {
        const d = this.db[this.state.region];
        const g = this.db.global;

        const first = this.state.gender === 'male' ? this.rand(d.firstM) : this.rand(d.firstF);
        const last = this.rand(d.last);
        const maiden = this.rand(d.last);
        const user = `${first.toLowerCase()}${last.toLowerCase()}${this.randNum(10,99)}`;

        const year = this.randNum(1950, 2002);
        const age = new Date().getFullYear() - year;

        const lat = (Math.random() * 180 - 90).toFixed(6);
        const lon = (Math.random() * 360 - 180).toFixed(6);

        const hFt = this.randNum(5, 6);
        const hIn = this.randNum(0, 11);
        const hCm = Math.round((hFt * 30.48) + (hIn * 2.54));
        const wLbs = this.randNum(130, 240);
        const wKg = (wLbs * 0.453592).toFixed(1);

        const ups = `1Z ${this.randNum(100,999)} ${this.randNum(10,99)} ${this.randNum(1000,9999)} ${this.randNum(100,999)} ${this.randNum(1,9)}`;
        const wu = `${this.randNum(1000000000, 9999999999)}`;
        const mg = `${this.randNum(10000000, 99999999)}`;

        let ssn = "---";
        if(this.state.region === 'us') ssn = `${this.randNum(100,999)}-${this.randNum(10,99)}-${this.randNum(1000,9999)}`;
        if(this.state.region === 'id') ssn = `3${this.randNum(100000000000000, 999999999999999)}`;
        if(this.state.region === 'jp') ssn = `${this.randNum(100000000000, 999999999999)}`;

        this.state.identity = {
            name: `${first} ${last}`,
            maiden: maiden,
            job: `${this.rand(g.companies)} - ${this.rand(d.jobs)}`,
            user: user,
            dob: `${this.randNum(1,28)}/${this.randNum(1,12)}/${year}`,
            zodiac: `${age} years old • ${this.rand(g.zodiacs)}`,
            ssn: ssn,
            physical: `${hFt}' ${hIn}" (${hCm} cm) • ${wLbs} lbs (${wKg} kg)`,
            blood: this.rand(g.bloodTypes),
            addr: `${this.randNum(100, 9999)} ${this.rand(d.streets)}`,
            city: `${this.rand(d.cities)} ${this.randNum(10000, 99999)}`,
            geo: `${lat}, ${lon}`,
            phone: `+${d.phoneCode} ${this.randNum(100,999)}-${this.randNum(1000,9999)}`,
            email: `${user}@jourrapide.com`,
            pass: `${last}${this.randNum(100,999)}!X`,
            website: `${user.toLowerCase()}.com`,
            ua: this.rand(g.uas),
            cc: this.generateCC(),
            exp: `${this.randNum(1,12).toString().padStart(2,'0')}/${this.randNum(25,32)}`,
            cvv: this.randNum(100, 999),
            ups: ups, wu: wu, mg: mg,
            veh: `${this.rand(g.colors)} ${this.rand(g.vehicles)}`,
            uuid: crypto.randomUUID()
        };

        this.state.avatar = `https://robohash.org/${user}?set=set3&bgset=bg2`;
        this.renderDOM();
    },

    renderDOM() {
        const i = this.state.identity;
        const setTxt = (id, val) => { const el = this.find(id); if(el) el.innerText = val || '---'; };

        const keys = ['name','maiden','job','user','dob','zodiac','ssn','physical','blood','addr','city','geo','phone','email','pass','website','ua','cc','exp','cvv','ups','wu','mg','veh','uuid'];
        keys.forEach(k => setTxt(`#val-${k}`, i[k]));

        const avatarEl = this.find('#val-avatar');
        if(avatarEl) {
            if(this.state.avatar) {
                avatarEl.src = this.state.avatar;
                avatarEl.style.opacity = '1';
            } else {
                avatarEl.style.opacity = '0';
            }
        }
    },

    updateView() {
        const f = (s) => this.find(s);
        ['#view-info', '#view-app'].forEach(id => { if(f(id)) f(id).classList.add('hidden'); });
        this.sys.setNav(this.state.tab === 'info' ? 'tab-info' : 'tab-app');

        if (this.state.tab === 'info') {
            if(f('#view-info')) f('#view-info').classList.remove('hidden');
            this.sys.setActionDock([]);
        } else {
            if(f('#view-app')) f('#view-app').classList.remove('hidden');
            this.sys.setActionDock([
                { id: 'act-clear', icon: '🗑️', labelKey: 'actionClear', color: 'danger' },
                { id: 'act-process', icon: '⚡', labelKey: 'btnForge', color: 'yellow' }
            ]);
        }
    }
};

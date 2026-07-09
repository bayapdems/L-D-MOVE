
const appState = {
 currentPage: 'home',
 reservation: {
 trajet: null,
 date: null,
 heure: null,
 siege: null,
 standing: null,
 },
 passager: {
 nom: null,
 tel: null,
 email: null,
 },
 paiement: {
 mode: null,
 montant: 0,
 },
 ticket: {
 ref: null,
 timestamp: null,
 }
};
// Routes et durées
const trajets = {
 'yaounde-douala': { nom: 'Yaoundé → Douala', duree: '3h', km: 240, prix: 3500 },
 'yaounde-kribi': { nom: 'Yaoundé → Kribi', duree: '4h', km: 280, prix: 4000 },
 'yaounde-edea': { nom: 'Yaoundé → Edéa', duree: '2h30', km: 180, prix: 2800 },
 'douala-kribi': { nom: 'Douala → Kribi', duree: '3h', km: 140, prix: 2500 },
 'kribi-edea': { nom: 'Kribi → Edéa', duree: '2h', km: 90, prix: 1800 },
 'douala-edea': { nom: 'Douala → Edéa', duree: '1h30', km: 60, prix: 1500 },
};
// ── Init 
document.addEventListener('DOMContentLoaded', () => {
 initNavigation();
 initSearch();
 initTrajetCards();
 initForm();
 initPayment();
 initFAQ();
});
// 
// ── PAGE NAVIGATION
// 
function showPage(pageName) {
 // Hide all pages
 document.querySelectorAll('.page').forEach(page => {
 page.classList.remove('active');
 });
 
 // Show target page
 const targetPage = document.getElementById(`page-${pageName}`);
 if (targetPage) {
 targetPage.classList.add('active');
 appState.currentPage = pageName;
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }
}
function initNavigation() {
 // Navbar links
 document.querySelectorAll('.nav-link').forEach(link => {
 link.addEventListener('click', (e) => {
 e.preventDefault();
 const pageName = link.dataset.page;
 
 // Update active state
 document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
 link.classList.add('active');
 
 showPage(pageName);
 closeHamburgerMenu();
 });
 });
 
 // Logo click to home
 document.querySelector('.nav-logo').addEventListener('click', () => {
 showPage('home');
 document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
 document.querySelector('[data-page="home"]').classList.add('active');
 });
 
 // Hamburger menu
 const hamburger = document.getElementById('hamburger');
 const navLinks = document.getElementById('navLinks');
 
 if (hamburger) {
 hamburger.addEventListener('click', () => {
 navLinks.classList.toggle('open');
 });
 }
 
 // Close menu on link click
 document.querySelectorAll('.nav-link').forEach(link => {
 link.addEventListener('click', closeHamburgerMenu);
 });
 
 
 // Navbar scroll effect
 window.addEventListener('scroll', () => {
 const navbar = document.getElementById('navbar');
 if (window.scrollY > 20) {
 navbar.classList.add('scrolled');
 } else {
 navbar.classList.remove('scrolled');
 }
 });
}
function closeHamburgerMenu() {
 const navLinks = document.getElementById('navLinks');
 if (navLinks) navLinks.classList.remove('open');
}
// 
// ── SEARCH & DESTINATIONS (HOME PAGE)
// 
function initSearch() {
 const swapBtn = document.getElementById('swapBtn');
 const btnSearch = document.getElementById('btnSearch');
 const searchDepart = document.getElementById('searchDepart');
 const searchArrivee = document.getElementById('searchArrivee');
 
 // Swap cities
 swapBtn.addEventListener('click', () => {
 const temp = searchDepart.value;
 searchDepart.value = searchArrivee.value;
 searchArrivee.value = temp;
 });
 
 
 // Search button
 btnSearch.addEventListener('click', () => {
 const depart = searchDepart.value;
 const arrivee = searchArrivee.value;
 const date = document.getElementById('searchDate').value;
 
 if (!depart || !arrivee || !date) {
 showToast('Veuillez remplir tous les champs', 'error');
 return;
 }
 
 if (depart === arrivee) {
 showToast('La ville de départ et d\'arrivée doivent être différentes', 'error');
 return;
 }
 
 // Go to trajets page
 showPage('trajets');
 });
}
function initTrajetCards() {
 // Destination cards on home
 document.querySelectorAll('[data-trajet]').forEach(card => {
 card.addEventListener('click', () => {
 const trajet = card.dataset.trajet;
 selectTrajet(trajet);
 });
 });
}
function selectTrajet(trajet) {
 appState.reservation.trajet = trajet;
 showPage('reservation');
 
 // Set trajet in form
 const resTrajet = document.getElementById('resTrajet');
 if (resTrajet) {
 if (resTrajet) {
 resTrajet.value = trajet;
 }
}
// 
// ── RESERVATION FORM (STEP 1)
// 
function initForm() {
 const btnStep1 = document.getElementById('btnStep1');
 const btnStep2 = document.getElementById('btnStep2');
 
 // Step 1: Trajet details
 if (btnStep1) {
 btnStep1.addEventListener('click', validateStep1);
 }
 
 // Step 2: Passager info
 if (btnStep2) {
 btnStep2.addEventListener('click', validateStep2);
 }
 
 // Update price summary on change
 const formInputs = [
 'resTrajet', 'resDate', 'resHeure', 'resSiege'
 ];
 
 formInputs.forEach(id => {
 const elem = document.getElementById(id);
 if (elem) {
 elem.addEventListener('change', updatePriceSummary);
 }
 });
 
 // Standing radio buttons
 document.querySelectorAll('input[name="standing"]').forEach(radio => {
 radio.addEventListener('change', updatePriceSummary);
 });
}
function validateStep1() {
 const trajet = document.getElementById('resTrajet').value;
 const date = document.getElementById('resDate').value;
 const heure = document.getElementById('resHeure').value;
 const siege = document.getElementById('resSiege').value;
 const standing = document.querySelector('input[name="standing"]:checked');
 
 if (!trajet || !date || !heure || !siege || !standing) {
 showToast('Veuillez remplir tous les champs', 'error');
 return;
 }
 
 // Save to state
 appState.reservation.trajet = trajet;
 appState.reservation.date = date;
 appState.reservation.heure = heure;
 appState.reservation.siege = siege;
 appState.reservation.standing = standing.value;
 
 // Calculate montant
 const trajetInfo = trajets[trajet];
 const prixBase = trajetInfo.prix;
 const multiplier = parseInt(siege);
 
 let prixFinal = prixBase * multiplier;
 
 if (standing.value === 'vip') prixFinal *= 1.15;
 if (standing.value === 'executive') prixFinal *= 1.35;
 
 appState.paiement.montant = prixFinal;
 
 showPage('passager');
}
function validateStep2() {
 const nom = document.getElementById('passNom').value.trim();
 const tel = document.getElementById('passTel').value.trim();
 const email = document.getElementById('passEmail').value.trim();
 
 if (!nom || !tel) {
 showToast('Nom et téléphone sont obligatoires', 'error');
 return;
 }
 
 if (tel.length < 8) {
 showToast('Numéro de téléphone invalide', 'error');
 return;
 }
 
 if (email && !email.includes('@')) {
 showToast('E-mail invalide', 'error');
 return;
 }
 
 // Save to state
 appState.passager.nom = nom;
 appState.passager.tel = tel;
 appState.passager.email = email || '';
 
 // Update recap on payment page
 updatePaymentRecap();
 
 showPage('paiement');
}
function updatePriceSummary() {
 const trajet = document.getElementById('resTrajet').value;
 const date = document.getElementById('resDate').value;
 const heure = document.getElementById('resHeure').value;
 const siege = document.getElementById('resSiege').value;
 const standing = document.querySelector('input[name="standing"]:checked');
 
 const summary = document.getElementById('priceSummary');
 
 if (trajet && date && heure && siege && standing) {
 summary.style.display = 'block';
 
 const trajetInfo = trajets[trajet];
 const prixBase = trajetInfo.prix;
 const multiplier = parseInt(siege);
 
 let prixFinal = prixBase * multiplier;
 let standingLabel = standing.value;
 
 if (standing.value === 'vip') {
 prixFinal *= 1.15;
 standingLabel = 'VIP (+15%)';
 }
 if (standing.value === 'executive') {
 prixFinal *= 1.35;
 standingLabel = 'Exécutif (+35%)';
 }
 
 if (standing.value === 'standard') standingLabel = 'Standard';
 
 document.getElementById('summTrajet').textContent = trajetInfo.nom;
 document.getElementById('summDate').textContent = formatDate(date);
 document.getElementById('summHeure').textContent = heure;
 document.getElementById('summSiege').textContent = siege;
 document.getElementById('summStanding').textContent = standingLabel;
 document.getElementById('summTotal').textContent = formatCurrency(prixFinal);
 } else {
 summary.style.display = 'none';
 }
}
function updatePaymentRecap() {
 const trajetInfo = trajets[appState.reservation.trajet];
 
 document.getElementById('recapNom').textContent = appState.passager.nom;
 document.getElementById('recapTrajet').textContent = trajetInfo.nom;
 document.getElementById('recapDate').textContent = formatDate(appState.reservation.date);
 document.getElementById('recapHeure').textContent = appState.reservation.heure;
 document.getElementById('recapSiege').textContent = appState.reservation.siege;
 document.getElementById('recapTotal').textContent = 
formatCurrency(appState.paiement.montant);
}
// 
// ── PAYMENT (STEP 3)
function initPayment() {
 const payOrange = document.getElementById('payOrange');
 const payMobile = document.getElementById('payMobile');
 
 if (payOrange) {
 payOrange.addEventListener('click', () => selectPayment('orange'));
 }
 if (payMobile) {
 payMobile.addEventListener('click', () => selectPayment('mobile'));
 }
}
function selectPayment(mode) {
 appState.paiement.mode = mode;
 
 // Update UI
 document.querySelectorAll('.payment-card').forEach(card => {
 card.classList.remove('selected');
 });
 
 if (mode === 'orange') {
 document.getElementById('payOrange').classList.add('selected');
 } else {
 document.getElementById('payMobile').classList.add('selected');
 }
 
 // Show form
 showPaymentForm(mode);
}
function showPaymentForm(mode) {
 const payForm = document.getElementById('payForm');
 const payFormTitle = document.getElementById('payFormTitle');
 const payMontant = document.getElementById('payMontant');
 
 if (mode === 'orange') {
 payFormTitle.innerHTML = '<i class="fas fa-lock"></i> Orange Money';
 } else {
 payFormTitle.innerHTML = '<i class="fas fa-lock"></i> Mobile Money';
 }
 
 payMontant.value = formatCurrency(appState.paiement.montant);
 payForm.style.display = 'block';
 
 // Set button handler
 const btnPay = document.getElementById('btnPay');
 btnPay.onclick = () => processPay(mode);
}
function cancelPayment() {
 document.getElementById('payForm').style.display = 'none';
 document.querySelectorAll('.payment-card').forEach(card => {
 card.classList.remove('selected');
 });
 appState.paiement.mode = null;
}
function processPay(mode) {
 const tel = document.getElementById('payTel').value.trim();
 const pin = document.getElementById('payPin').value.trim();
 
 if (!tel || !pin) {
 showToast('Veuillez entrer tous les détails', 'error');
 return;
 }
 
 if (tel.length < 8) {
 showToast('Numéro de téléphone invalide', 'error');
 return;
 }
 
 if (pin.length < 4) {
 showToast('Code secret invalide (minimum 4 chiffres)', 'error');
 return;
 }
 
 // Show loading
 document.getElementById('payForm').style.display = 'none';
 document.getElementById('payLoading').style.display = 'block';
 
 // Simulate payment processing (3 seconds)
 setTimeout(() => {
 processPaymentSuccess();
 }, 3000);
}
function processPaymentSuccess() {
 document.getElementById('payLoading').style.display = 'none';
 
 // Generate ticket reference
 const ref = 'DLM' + Math.random().toString(36).substr(2, 9).toUpperCase();
 appState.ticket.ref = ref;
 appState.ticket.timestamp = new Date();
 
 // Show ticket
 updateTicketDisplay();
 showPage('ticket');
 showToast('Paiement effectué avec succès !!', 'success');
}
function updateTicketDisplay() {
 const trajetInfo = trajets[appState.reservation.trajet];
 const [depart, arrivee] = appState.reservation.trajet.split('-');
 
 document.getElementById('ticketRef').textContent = appState.ticket.ref;
 document.getElementById('ticketDepart').textContent = trajetInfo.nom.split(' → ')[0];
 document.getElementById('ticketArrivee').textContent = trajetInfo.nom.split(' → ')[1];
 document.getElementById('ticketNom').textContent = appState.passager.nom;
 document.getElementById('ticketDate').textContent = formatDate(appState.reservation.date);
 document.getElementById('ticketHeure').textContent = appState.reservation.heure;
 document.getElementById('ticketSiege').textContent = 'Siège ' + appState.reservation.siege;
 document.getElementById('ticketStanding').textContent = 
appState.reservation.standing.charAt(0).toUpperCase() + appState.reservation.standing.slice(1);
 document.getElementById('ticketTel').textContent = '+237 ' + appState.passager.tel;
 document.getElementById('ticketMontant').textContent = 
formatCurrency(appState.paiement.montant);
}
function downloadTicket() {
 showToast('Ticket téléchargé !' , 'success');
 // In a real app, this would generate a PDF
}
function newReservation() {
 // Reset state
 appState.reservation = {
 trajet: null, date: null, heure: null, siege: null, standing: null,
 };
 appState.passager = {
 nom: null, tel: null, email: null,
 };
 appState.paiement = {
 mode: null, montant: 0,
 };
 
 // Clear forms
 document.getElementById('resTrajet').value = '';
 document.getElementById('resDate').value = '';
 document.getElementById('resHeure').value = '';
 document.getElementById('resSiege').value = '';
 document.querySelectorAll('input[name="standing"]').forEach(r => r.checked = false);
 
 document.getElementById('passNom').value = '';
 document.getElementById('passTel').value = '';
 document.getElementById('passEmail').value = '';
 
 document.getElementById('payTel').value = '';
 document.getElementById('payPin').value = '';
 
 showPage('home');
}
// 
// ── FAQ
// 
function initFAQ() {
 document.querySelectorAll('.faq-question').forEach(btn => {
 btn.addEventListener('click', function() {
 const item = this.parentElement;
 
 // Close other items
 document.querySelectorAll('.faq-item').forEach(el => {
 if (el !== item) el.classList.remove('open');
 });
 
 // Toggle current item
 item.classList.toggle('open');
 });
 });
}
function toggleFaq(button) {
 const item = button.parentElement;
 
 document.querySelectorAll('.faq-item').forEach(el => {
 if (el !== item) el.classList.remove('open');
 });
 
 item.classList.toggle('open');
}
// 
// ── AUTH
// 
function switchAuth(form) {
 const loginForm = document.getElementById('loginForm');
 const signupForm = document.getElementById('signupForm');
 
 if (form === 'signup') {
 loginForm.style.display = 'none';
 signupForm.style.display = 'block';
 } else {
 loginForm.style.display = 'block';
 signupForm.style.display = 'none';
 }
}
function togglePwd(inputId, btn) {
 const input = document.getElementById(inputId);
 if (input.type === 'password') {
 input.type = 'text';
 btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
 } else {
 input.type = 'password';
 btn.innerHTML = '<i class="fas fa-eye"></i>';
 }
}
// 
// ── UTILITIES
// 
function formatCurrency(amount) {
 return new Intl.NumberFormat('fr-CM', {
 style: 'currency',
 currency: 'XAF',
 minimumFractionDigits: 0,
 maximumFractionDigits: 0,
 }).format(amount);
}
function formatDate(dateStr) {
 const options = { year: 'numeric', month: 'long', day: 'numeric' };
 return new Date(dateStr).toLocaleDateString('fr-FR', options);
}
function showToast(message, type = 'default') {
 const toast = document.getElementById('toast');
 toast.textContent = message;
 toast.className = `toast show ${type}`;
 
 setTimeout(() => {
 toast.classList.remove('show');
 }, 4000);
}
// Log app info
console.log('%c #L&D MOVE', 'font-size:20px;font-weight:bold;color:#00c6ff;');
console.log('%cVoyagez mieux, payez moins.', 'font-size:12px;color:#00c6ff;font-style:italic;');}
(() => {
  'use strict';
  const CFG = window.DEGUSTE_CONFIG || {};
  const SERVICE_LABELS = {
    'bar-drinks': 'Bar de Drinks',
    'crepe-frances': 'Crepe Francês',
    'massas-ao-vivo': 'Massas ao Vivo (Macarrão)',
    'barca-coco': 'Barca de Coco',
    'barca-shot': 'Barca de Shot',
    'coffee-break': 'Coffee Break',
    personalizado: 'Outra experiência personalizada',
    // Compatibilidade com seleções anteriores
    drinks: 'Bar de Drinks',
    coco: 'Barca de Coco',
    'boas-vindas': 'Mesa de boas-vindas',
    'antes-sim': 'Mesa antes do sim',
    'depois-sim': 'Mesa depois do sim'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const form = $('#quote-form');
  let lastFocus = null;
  let toastTimeout;

  // A presença do arquivo de foto ativa automaticamente a imagem no site.
  $$('.photo-slot[data-photo]').forEach((slot) => {
    const url = `assets/fotos/${slot.dataset.photo}`;
    const photo = new Image();
    photo.onload = () => {
      slot.style.backgroundImage = `url("${url}")`;
      slot.classList.add('has-photo');
      slot.setAttribute('aria-label', slot.dataset.label || 'Foto da Degust');
      if (slot.classList.contains('gallery-item')) {
        slot.tabIndex = 0;
        slot.role = 'button';
        slot.setAttribute('aria-label', `Ampliar: ${slot.dataset.label}`);
      }
    };
    photo.src = url;
  });

  // Navegação para celular.
  const mobileNav = $('#mobile-nav');
  const menuButton = $('#menu-button');
  function closeMenu() {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
  menuButton.addEventListener('click', () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  });
  $$('a', mobileNav).forEach((a) => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  // Galeria filtrável.
  $$('.gallery-filter').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.gallery-filter').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      const active = button.dataset.filter;
      $$('.gallery-item').forEach((item) => {
        item.classList.toggle('is-hidden', active !== 'todas' && item.dataset.category !== active);
      });
    });
  });

  // Galeria com ampliação ao clicar e navegação anterior/próxima.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightbox-image');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxPrev = $('#lightbox-prev');
  const lightboxNext = $('#lightbox-next');
  let currentGalleryItems = [];
  let currentGalleryIndex = 0;

  function updateGalleryActiveList() {
    currentGalleryItems = $$('.gallery-item:not(.is-hidden)').filter((item) => item.classList.contains('has-photo'));
  }

  function displayLightboxPhoto(index) {
    if (!currentGalleryItems.length) return;
    currentGalleryIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    const item = currentGalleryItems[currentGalleryIndex];
    lightboxImage.src = `assets/fotos/${item.dataset.photo}`;
    lightboxImage.alt = item.dataset.label;
    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${item.dataset.label}</strong> <span style="opacity:.7;margin-left:8px;">(${currentGalleryIndex + 1} de ${currentGalleryItems.length})</span>`;
    }
  }

  function openLightbox(item) {
    updateGalleryActiveList();
    const idx = currentGalleryItems.indexOf(item);
    if (idx === -1) return;
    lastFocus = document.activeElement;
    displayLightboxPhoto(idx);
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    $('#lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    lightboxImage.removeAttribute('src');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  $$('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('has-photo')) openLightbox(item);
    });
    item.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && item.classList.contains('has-photo')) {
        e.preventDefault(); openLightbox(item);
      }
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxPhoto(currentGalleryIndex - 1);
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      displayLightboxPhoto(currentGalleryIndex + 1);
    });
  }
  $('#lightbox-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) displayLightboxPhoto(currentGalleryIndex - 1);
      else displayLightboxPhoto(currentGalleryIndex + 1);
    }
  }, { passive: true });

  // Vídeos & Reels: filtros, expansão e modal
  const videoModal = $('#video-modal');
  const videoPlayer = $('#video-player');
  const videoModalTitle = $('#video-modal-title');
  const videoModalBadge = $('#video-modal-badge');
  const videoModalClose = $('#video-modal-close');
  const toggleMoreVideos = $('#toggle-more-videos');

  function openVideoModal(card) {
    lastFocus = document.activeElement;
    videoPlayer.src = card.dataset.video;
    videoModalTitle.textContent = card.dataset.title;
    videoModalBadge.textContent = card.dataset.badge;
    videoModal.hidden = false;
    document.body.classList.add('no-scroll');
    videoPlayer.play().catch(() => {});
    if (videoModalClose) videoModalClose.focus();
  }

  function closeVideoModal() {
    if (!videoModal) return;
    videoModal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.removeAttribute('src');
      videoPlayer.load();
    }
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
  if (videoModal) videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });

  $$('.video-card').forEach((card) => {
    card.addEventListener('click', () => openVideoModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); openVideoModal(card);
      }
    });
  });

  // Filtros de vídeos
  $$('.video-filter').forEach((button) => {
    button.addEventListener('click', () => {
      $$('.video-filter').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      const active = button.dataset.vfilter;
      $$('.video-card').forEach((card) => {
        const matches = active === 'todos' || card.dataset.category === active;
        card.classList.toggle('is-hidden', !matches);
      });
      if (active !== 'todos') {
        $$('.video-card:not(.is-hidden)').forEach((card) => card.classList.remove('is-collapsed'));
      }
    });
  });

  // Botão Ver mais vídeos
  if (toggleMoreVideos) {
    toggleMoreVideos.addEventListener('click', () => {
      const isExpanded = toggleMoreVideos.getAttribute('aria-expanded') === 'true';
      $$('.video-extra').forEach((card) => {
        card.classList.toggle('is-collapsed', isExpanded);
      });
      toggleMoreVideos.setAttribute('aria-expanded', String(!isExpanded));
      toggleMoreVideos.innerHTML = isExpanded 
        ? '<span>Ver todos os 41 vídeos</span> <span class="arrow-down" aria-hidden="true">↓</span>'
        : '<span>Ver menos vídeos</span> <span class="arrow-up" aria-hidden="true">↑</span>';
    });
  }

  // Seleções ligadas entre os cards de experiências e o formulário.
  function selectedServices() {
    return $$('input[name="servicos"]:checked', form).map((input) => input.value);
  }
  function renderSummary() {
    const read = (id) => $(id).value.trim();
    $('#summary-event').textContent = read('#event-type') || 'A definir';
    const date = read('#event-date');
    if (date) {
      const [year, month, day] = date.split('-');
      $('#summary-date').textContent = `${day}/${month}/${year}`;
    } else {
      $('#summary-date').textContent = 'A definir';
    }
    const guests = read('#guests');
    $('#summary-guests').textContent = guests && Number(guests) > 0 ? `${Number(guests).toLocaleString('pt-BR')} pessoas` : 'A definir';
    $('#summary-location').textContent = read('#event-location') || 'A definir';
    const services = selectedServices();
    $('#summary-count').textContent = services.length;
    const target = $('#summary-services');
    target.replaceChildren();
    if (!services.length) {
      const p = document.createElement('p');
      p.textContent = 'Escolha uma experiência para começar a montar seu pedido.';
      target.append(p);
    } else {
      services.forEach((service) => {
        const pill = document.createElement('span');
        pill.className = 'summary-pill';
        pill.textContent = SERVICE_LABELS[service];
        target.append(pill);
      });
    }
    $$('[data-add-service]').forEach((b) => {
      const active = services.includes(b.dataset.addService);
      b.setAttribute('aria-pressed', String(active));
      b.innerHTML = active ? 'Selecionado para seu evento <span aria-hidden="true">✓</span>' : 'Adicionar ao orçamento <span aria-hidden="true">＋</span>';
    });
  }
  $$('[data-add-service]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = $(`input[name="servicos"][value="${button.dataset.addService}"]`, form);
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
      notify(input.checked ? 'Experiência adicionada ao orçamento.' : 'Experiência retirada do orçamento.');
    });
  });
  $$('input,select,textarea', form).forEach((input) => {
    input.addEventListener('input', renderSummary);
    input.addEventListener('change', renderSummary);
  });
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  $('#event-date').min = currentDate;
  renderSummary();

  function notify(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }
  function error(id, message) {
    const holder = $(`#error-${id}`);
    if (holder) holder.textContent = message;
    const input = $(`#${id}`);
    if (input) input.setAttribute('aria-invalid', String(!!message));
  }
  function validate() {
    ['event-type', 'guests', 'event-location', 'customer-name', 'customer-phone', 'services', 'consent'].forEach((id) => error(id, ''));
    let valid = true;
    let firstInvalid = null;
    const fail = (id, message, focusSelector) => {
      error(id, message); valid = false;
      if (!firstInvalid) firstInvalid = $(focusSelector || `#${id}`);
    };
    if (!$('#event-type').value) fail('event-type', 'Selecione o tipo do evento.');
    const guests = Number($('#guests').value);
    if (!Number.isInteger(guests) || guests < 1 || guests > 100000) fail('guests', 'Informe uma quantidade válida de convidados.');
    if (!$('#event-location').value.trim()) fail('event-location', 'Informe onde será o evento.');
    if (selectedServices().length === 0) fail('services', 'Selecione ao menos uma experiência.', '#service-options');
    if ($('#customer-name').value.trim().length < 2) fail('customer-name', 'Informe seu nome.');
    const digits = $('#customer-phone').value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) fail('customer-phone', 'Informe um WhatsApp com DDD válido.');
    if (!$('#consent').checked) fail('consent', 'Confirme a autorização para contato.');
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof firstInvalid.focus === 'function') firstInvalid.focus({ preventScroll: true });
    }
    return valid;
  }
  const cleanOneLine = (v) => v.trim().replace(/\s+/g, ' ');
  function buildMessage() {
    const date = $('#event-date').value;
    const prettyDate = date ? date.split('-').reverse().join('/') : 'A definir';
    const services = selectedServices().map((id) => `• ${SERVICE_LABELS[id]}`).join('\n');
    const details = $('#details').value.trim();
    const lines = [
      'Olá, Degust! Gostaria de solicitar um orçamento para o meu evento. ✨', '',
      '*DADOS DO EVENTO*',
      `• Ocasião: ${$('#event-type').value}`,
      `• Data: ${prettyDate}`,
      `• Convidados: ${$('#guests').value}`,
      `• Local: ${cleanOneLine($('#event-location').value)}`, '',
      '*EXPERIÊNCIAS DE INTERESSE*', services
    ];
    if (details) lines.push('', '*DETALHES ADICIONAIS*', details);
    lines.push('', '*MEU CONTATO*', `• Nome: ${cleanOneLine($('#customer-name').value)}`, `• WhatsApp: ${cleanOneLine($('#customer-phone').value)}`, '', 'Aguardo o retorno. Obrigado(a)!');
    return lines.join('\n');
  }
  const modal = $('#quote-modal');
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal && !videoModal.hidden) closeVideoModal();
      else if (!lightbox.hidden) closeLightbox();
      else if (!modal.hidden) closeModal();
      else if (!mobileNav.hidden) closeMenu();
    } else if (!lightbox.hidden) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        displayLightboxPhoto(currentGalleryIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        displayLightboxPhoto(currentGalleryIndex + 1);
      }
    }
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const message = buildMessage();
    $('#message-preview').value = message;
    const number = String(CFG.whatsapp || '').replace(/\D/g, '');
    const validNumber = number.length >= 12 && number.length <= 13 && number.startsWith('55');
    $('#send-whatsapp').hidden = !validNumber;
    if (validNumber) {
      $('#send-whatsapp').href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      $('#modal-info').textContent = 'Seu pedido está organizado. Confira os detalhes e envie diretamente pelo WhatsApp.';
      $('#modal-notice').textContent = '';
    } else {
      $('#modal-info').textContent = 'Sua mensagem está pronta para copiar. O envio direto ficará disponível assim que o número da empresa for configurado.';
      $('#modal-notice').textContent = 'Para ativar o botão de envio, configure o WhatsApp no arquivo js/config.js.';
    }
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    $('#modal-close').focus();
  });
  $('#copy-message').addEventListener('click', async () => {
    const value = $('#message-preview').value;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        $('#message-preview').focus();
        $('#message-preview').select();
        if (!document.execCommand('copy')) throw Error('copy blocked');
      }
      notify('Mensagem copiada!');
    } catch (_error) {
      $('#message-preview').focus();
      $('#message-preview').select();
      notify('Selecione e copie o texto do campo acima.');
    }
  });
  
  // Contatos: não exibir links inventados se não estiverem configurados.
  const phone = String(CFG.whatsapp || '').replace(/\D/g, '');
  if (phone.startsWith('55') && phone.length >= 12 && phone.length <= 13) {
    $('#footer-whatsapp').href = `https://wa.me/${phone}?text=${encodeURIComponent('Olá! Gostaria de solicitar um orçamento para um evento.')}`;
    $('#footer-whatsapp').target = '_blank';
    $('#footer-whatsapp').rel = 'noopener noreferrer';
  }
  if (/^https:\/\/(www\.)?instagram\.com\//i.test(CFG.instagram || '')) {
    $('#footer-instagram').href = CFG.instagram;
    $('#footer-instagram').hidden = false;
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CFG.email || '')) {
    $('#footer-email').href = `mailto:${CFG.email}`;
    $('#footer-email').hidden = false;
  }
  if (CFG.regiao) {
    $('#footer-region').textContent = CFG.regiao;
    $('#footer-region').hidden = false;
  }
  $('#year').textContent = now.getFullYear();
})();

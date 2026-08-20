// -------------------------------------------------------------
// 书影预览与素雅交互脚本
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // 1. 图片数据清单
  const imagesData = [
    {
      src: 'pics/cixi01 (3).jfif',
      title: '书影装帧 · 封面',
      desc: '《慈禧：开启现代中国的皇太后》（张戎 著）封面'
    },
    {
      src: 'pics/cixi01 (2).jfif',
      title: '内封题名 · 扉页',
      desc: '内页书名、著译者与版权出版信息'
    },
    {
      src: 'pics/cixi01 (1).jfif',
      title: '正文选读 · 书页',
      desc: '清同治年间平定江南及常胜军戈登相关叙述正文'
    }
  ];

  // 2. 随览感怀语录
  const quotes = [
    "“历史的细节往往藏在字里行间。”",
    "“静水流深，回望百年前的风云变幻与历史抉择。”",
    "“一册书影，半部沧桑。在铅字中感知时代的脉搏。”",
    "“素笺淡墨，沉淀的是岁月，留下的是思索。”",
    "“观史如照镜，见微以知著。”"
  ];

  let currentQuoteIndex = 0;
  let currentLightboxIndex = 0;

  // DOM 元素引用
  const quoteDisplay = document.getElementById('quote-display');
  const actionBtn = document.getElementById('btn');
  const viewToggleBtn = document.getElementById('view-toggle-btn');
  const viewModeText = document.getElementById('view-mode-text');
  const galleryGrid = document.getElementById('gallery-grid');

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const backdrop = document.getElementById('lightbox-backdrop');

  // 3. 点击按钮切换感怀随笔
  if (actionBtn && quoteDisplay) {
    actionBtn.addEventListener('click', () => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      quoteDisplay.style.opacity = '0';
      setTimeout(() => {
        quoteDisplay.textContent = quotes[currentQuoteIndex];
        quoteDisplay.style.transition = 'opacity 0.4s ease';
        quoteDisplay.style.opacity = '1';
      }, 150);
    });
  }

  // 4. 网格 / 单列聚焦模式切换
  if (viewToggleBtn && galleryGrid) {
    let isSingleColumn = false;
    viewToggleBtn.addEventListener('click', () => {
      isSingleColumn = !isSingleColumn;
      if (isSingleColumn) {
        galleryGrid.classList.add('single-column');
        viewModeText.textContent = '多列网格';
      } else {
        galleryGrid.classList.remove('single-column');
        viewModeText.textContent = '单列聚焦';
      }
    });
  }

  // 5. 大图浏览 (Lightbox) 功能
  function openLightbox(index) {
    if (index < 0 || index >= imagesData.length) index = 0;
    currentLightboxIndex = index;
    const item = imagesData[index];
    if (!item || !lightbox || !lightboxImg) return;

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    if (lightboxCaption) {
      lightboxCaption.textContent = `${item.title} — ${item.desc} (${index + 1}/${imagesData.length})`;
    }

    lightbox.style.display = 'flex';
    // 强制触发重绘后再加 class 确保渐变动画正常
    requestAnimationFrame(() => {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 250);
    document.body.style.overflow = '';
  }

  function nextImage(e) {
    if (e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % imagesData.length;
    openLightbox(currentLightboxIndex);
  }

  function prevImage(e) {
    if (e) e.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + imagesData.length) % imagesData.length;
    openLightbox(currentLightboxIndex);
  }

  // 绑定卡片图框与“查看大图”按钮事件
  document.querySelectorAll('.photo-frame').forEach((frame) => {
    frame.addEventListener('click', (e) => {
      e.preventDefault();
      const card = frame.closest('.photo-card');
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(isNaN(idx) ? 0 : idx);
    });
    // 支持 Enter 键开启
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = frame.closest('.photo-card');
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openLightbox(isNaN(idx) ? 0 : idx);
      }
    });
  });

  document.querySelectorAll('.btn-preview').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      openLightbox(isNaN(idx) ? 0 : idx);
    });
  });

  // 灯箱控制事件绑定
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeLightbox();
    });
  }

  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // 键盘快捷键响应 (Esc 关闭, 左右方向键切换)
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });
});

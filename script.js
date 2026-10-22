(() => {
  const canvas = document.getElementById('drawing');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let marks = [];
    const colors = ['#fa5260', '#6989ff', '#e9d8c5', '#d64c77'];
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      marks.forEach(draw);
    }
    function draw(mark) {
      ctx.save();
      ctx.translate(mark.x, mark.y);
      ctx.rotate(mark.rotation);
      ctx.strokeStyle = mark.color;
      ctx.globalAlpha = .88;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
        ctx.lineTo(Math.cos(angle) * mark.size, Math.sin(angle) * mark.size);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fillStyle = mark.color;
      ctx.fill();
      ctx.restore();
    }
    canvas.addEventListener('pointerdown', event => {
      const rect = canvas.getBoundingClientRect();
      const mark = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        size: 8 + Math.random() * 15,
        rotation: Math.random() * Math.PI,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      marks.push(mark);
      draw(mark);
    });
    new ResizeObserver(resize).observe(canvas);
    resize();
  }

  const viewer = document.querySelector('.image-viewer');
  if (!viewer) return;
  const viewerImage = viewer.querySelector('img');
  const viewerCaption = viewer.querySelector('p');
  function openViewer(image) {
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = image.dataset.caption || image.alt;
    viewer.showModal();
  }
  document.querySelectorAll('.zoomable').forEach(image => {
    image.addEventListener('click', () => openViewer(image));
    image.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openViewer(image);
      }
    });
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
})();

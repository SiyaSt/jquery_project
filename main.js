$(function () {
    generateBubbles(30);

    function generateBubbles(count) {
        const $container = $('#background-bubbles');
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 80 + 20;
            const top = Math.random() * 100;
            const left = Math.random() * 100;

            const $bubble = $('<div class="bubble"></div>').css({
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
            });

            $container.append($bubble);
        }
    }

    let images = [];
    let visibleImages = [];
    let currentIndex = 0;

    const $gallery = $('#gallery');
    $.getJSON('images.json', function (data) {
        images = data;
        visibleImages = images;
        renderGallery(visibleImages);
        showPreview(0);
    });

    function showPreview(index) {
        const img = visibleImages[index];
        currentIndex = index;
        $('#preview').fadeOut(200, function () {
            $(this).attr('src', img.src).fadeIn(300);
        });

        const description = img.description || `Category: ${img.category}` || 'No description';
        $('#image-description').hide().text(description).fadeIn(400);
    }
    
    function renderGallery(imgArray) {
        $gallery.empty();
        visibleImages = imgArray;
        imgArray.forEach((img, index) => {
            const item = $(`<img class="gallery-item" src="${img.src}" data-category="${img.category}" alt="">`);
            $gallery.append(item);
            setTimeout(() => {
                item.addClass('visible');
            }, 100 * index);
        });
    }

    $gallery.on('click', '.gallery-item', function () {
        const src = $(this).attr('src');
        const index = visibleImages.findIndex(img => img.src === src);
        if (index !== -1) {
            showPreview(index);
        }
    });
    
    $('#next').click(() => {
        const nextIndex = (currentIndex + 1) % visibleImages.length;
        showPreview(nextIndex);
    });

    $('#prev').click(() => {
        const prevIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        showPreview(prevIndex);
    });
    
    $('#gallery-controls button').click(function () {
        const filter = $(this).data('filter');
        const filtered = (filter === 'all') ? images : images.filter(img => img.category === filter);
        renderGallery(filtered);
        showPreview(0);
    });

});

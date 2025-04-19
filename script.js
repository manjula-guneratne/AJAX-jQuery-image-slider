let currentIndex = 0;
let timer = null;
let imageList = [];

function showImage() {
  if (imageList.length === 0) return;

  const currentImage = imageList[currentIndex];
  $("#image").fadeOut(500, function () {
    $("#image").attr("src", "images/"+currentImage.filename);
    $("#image").fadeIn(500);
  });

  // Restart timer
  if (timer) clearTimeout(timer);
  timer = setTimeout(nextImage, currentImage.duration * 1000);
}

function loadImages() {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "image.txt", true);
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      const lines = xhttp.responseText.trim().split("\n");
      imageList = lines.map((line) => {
        const [filename, durationStr] = line.trim().split(" ");
        return {
          filename: filename,
          duration: parseInt(durationStr, 10) || 3, // default 3s if invalid
        };
      });

      currentIndex = 0;
      showImage();
    }
  };
  xhttp.send();
}

function nextImage() {
  currentIndex = (currentIndex + 1) % imageList.length;
  showImage();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + imageList.length) % imageList.length;
  showImage();
}

$("#nextBtn").on("click", function () {
  if (timer) clearTimeout(timer);
  nextImage();
});

$("#prevBtn").on("click", function () {
  if (timer) clearTimeout(timer);
  prevImage();
});

$("#updateBtn").on("click", function () {
  if (timer) clearTimeout(timer);
  currentIndex = 0; // Reset to first image
  showImage(); // Show the first image immediately
});

loadImages();

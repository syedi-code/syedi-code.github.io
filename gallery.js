{/* <section class="sketch-gallery">
    <img class="p5sketch" src="../gallery/07.gif" />
    <img class="p5sketch" src="../gallery/00.png" />
</section> */}

var body = document.body

function insertImage(photoUrl) {
    var gallery = document.getElementById('sketch-gallery')

    var img = document.createElement('img')
    img.classList.add('p5sketch')
    img.src = photoUrl
    gallery.appendChild(img)

    console.log("== gallery", gallery)
}

insertImage("../gallery/06.gif")
insertImage("../gallery/07.gif")
insertImage("../gallery/00.png")
insertImage("../gallery/01.png")
insertImage("../gallery/02.gif")
insertImage("../gallery/03.gif")
insertImage("../gallery/04.png")
insertImage("../gallery/05.png")
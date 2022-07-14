const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
const previewImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterSlider = document.querySelector(".slider input");
const filterValue = document.querySelector(".slider .value");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImgBtn = document.querySelector(".save-img");

//another method of declaring variables
let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilters = () => {
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
}

//loading image into preview-img
const loadImage = () => {
    let file = fileInput.files[0]; //getting user selected file
    if (!file) return; //return if user has not selected file
    previewImg.src = URL.createObjectURL(file); //passing file URL as preview-img
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click(); // clicks reset button when user selects new img
        document.querySelector(".container").classList.remove("disable");
    })
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => { //adding click event listener to filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText; 

        if (option.id == "brightness"){
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id == "saturation"){
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id == "inversion"){
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); //getting selected filter button

    if (selectedFilter.id == "brightness"){
        brightness = filterSlider.value;
    } else if (selectedFilter.id == "saturation"){
        saturation = filterSlider.value;
    } else if (selectedFilter.id == "inversion"){
        inversion = filterSlider.value;
    } else if (selectedFilter.id == "grayscale"){
        grayscale = filterSlider.value;
    } 
    
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => { //adding click event listener to all rotate/flip buttons
        if (option.id === "left"){
            rotate -= 90; //if clicked button is left rotate, decrement rotate  value by -90
        } else if (option.id === "right"){
            rotate += 90;
        } else if (option.id === "horizontal"){
            flipHorizontal = flipHorizontal === 1? -1 : 1; //if flipHorizontal value is 1, set this value to -1 else set to 1
        } else if (option.id === "vertical"){
            flipVertical = flipVertical === 1? -1 : 1; //if flipVerticalal value is 1, set this value to -1 else set to 1
        }
        applyFilters();
    });
    
});

const resetFilter = () => {
    //resetting all variables to default
     brightness = 100; saturation = 100; inversion = 0; grayscale = 0;
     rotate = 0; flipHorizontal = 1; flipVertical = 1;
     filterOptions[0].click(); // Brightness is selected by default once reset button is clicked
     applyFilters();
}

const saveImage = () => {
    const canvas = document.createElement("canvas"); //creates a canvas element
    const ctx = canvas.getContext("2d"); //returns a drawing context on the canvas
    canvas.width = previewImg.naturalWidth; //sets canvas width to actual image width
    canvas.height = previewImg.naturalHeight; //sets canvas height to actual image height

    //applying user selected filters
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2); //translates canvas from center
    if (rotate !== 0){
        ctx.rotate(rotate * Math.PI / 180); // if rotate value is not 0, rotate canvas
    }

    ctx.scale(flipHorizontal, flipVertical); //flip canvas horizontally / vertically
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height /2, canvas.width, canvas.height); //drawImage(imagesource, dx, dy, dwidth, dheight)
   // document.body.appendChild(canvas); //adds canvas to body of document
    const link = document.createElement("a"); 
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
filterSlider.addEventListener("input", updateFilter);

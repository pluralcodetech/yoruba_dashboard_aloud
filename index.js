
// Function for Registration
function signUp(event) {
    event.preventDefault();
    let getName = document.getElementById("name");
    let getEmail = document.getElementById("email");
    let getPass = document.getElementById("password");
    let confirmPass = document.getElementById("confirmPassword");
    let getNameValue = getName.value;
    let getEmailValue = getEmail.value;
    let getPassValue = getPass.value;
    let getConfirmValue = confirmPass.value;
    if (getNameValue == "" || getEmailValue == "" || getPassValue == "" || getConfirmValue == "") {
        Swal.fire({
            icon: 'info',
            text: 'All input fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else if (getConfirmValue !== getPassValue) {
        Swal.fire({
            icon: 'info',
            text: 'Passwords do not match',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let SignOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                "name": getNameValue,
                "email": getEmailValue,
                "password": getPassValue,
                "password_confirmation": getConfirmValue
            })
        };
        let url = "https://codesandbox.com.ng/yorubalearning/api/register_admin";
        console.log(getNameValue);
        fetch(url, SignOptions)
            .then(response => response.json())
            .then(result => {
            console.log(result);
            if (result.status === "success") {
                window.location.replace("index.html");
            }
        })
            .catch(error => console.log('error', error));
    }
}


// Function for Login
function logIn(event) {
    event.preventDefault();
    const getLogEmail = document.getElementById("email");
    const getPassword = document.getElementById("password");
    const getLog = getLogEmail.value;
    const getPass = getPassword.value;
    if (getLog === "" || getPass === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {

        const formData = new FormData();
        formData.append("email", getLog);
        formData.append("password", getPass);

        const logOptions = {
            method: 'POST',
            body: formData,
            redirect: "follow"
        };
        const url = "https://codesandbox.com.ng/yorubalearning/api/admin_login";
        fetch(url, logOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            localStorage.setItem('loginData', JSON.stringify(result));
            let details = localStorage.getItem('loginData');
            let theDetails = JSON.parse(details)
            console.log(theDetails);
            if (theDetails.hasOwnProperty("email")) {
                window.location.href = "dashboard.html";
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Incorrect Login Details',
                    confirmButtonColor: '#2D85DE'
                });
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function to create category
function createCategory(event) {
    event.preventDefault();

    const catName = document.getElementById("cat").value;
    const getImage = document.getElementById("imcat").files[0];
    const getForm = document.getElementById("catForm");

    if (catName === "" || getImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        const getToken = localStorage.getItem('loginData');
        const token = JSON.parse(getToken);
        const theToken = token.token;

        let catHeader = new Headers();
        catHeader.append("Authorization", `Bearer ${theToken}`);

        const fd = new FormData();
        fd.append("name", catName);
        fd.append("image", getImage);


        const catOptions = {
            method: 'POST',
            headers: catHeader,
            body: fd
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_category";
        fetch(url, catOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'Category created successfully',
                    confirmButtonColor: '#2D85DE'
                })
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));

    }
}

// Function for category list
function getCatList() {
    const getScrollItem = document.querySelector(".scroll-object");
    const getToken = localStorage.getItem('loginData');
    const token = JSON.parse(getToken);
    const myToken = token.token;

    const listHeaders = new Headers();
    listHeaders.append("Authorization", `Bearer ${myToken}`);

    const listOptions = {
        method: 'GET',
        headers: listHeaders
    }

    let data = [];

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/category_list";

    fetch(url, listOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            data += `
            <div class="search-card">
              <a href="details.html?id=${item.id}&name=${item.name}"><img src=${item.image} alt="image" /></a>
              <p>${item.name}</p>
              <div class="text-right">
                <button class="update-button" onclick="openModal(${item.id})">Update</buton>
                <button class="delete-button" onclick="deleteCategory(${item.id})">Delete</buton>
              </div>
            </div>
            `
            getScrollItem.innerHTML = data;
        })
    })
    .catch(error => console.log('error', error));
}

getCatList()

// Function for deleting a category
function deleteCategory(id) {
    const getDelToken = localStorage.getItem('loginData');
    const delToken = JSON.parse(getDelToken);
    const deleteToken = delToken.token;


    const deleteHeaders = new Headers();
    deleteHeaders.append("Authorization", `Bearer ${deleteToken}`);

    const deleteRequest = {
        method: 'GET',
        headers: deleteHeaders
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_category/` + `${id}`;

    fetch(url, deleteRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if(result.status === "success") {
            location.reload();
        }else {
            Swal.fire({
                icon: 'info',
                text: 'Delete Unsuccessful!',
                confirmButtonColor: '#2D85DE'
            })
        }
    })
    .catch(error => console.log('error', error));
}

let getUnique;
// function for opening modal
function openModal(itemid) {
    localStorage.setItem("uniqueId", itemid)
    const getMyUnique = localStorage.getItem('uniqueId');
    const theUnique = JSON.parse(getMyUnique);
    getUnique = theUnique;
    console.log(getUnique);

    const catTok = localStorage.getItem("loginData");
    const catTok2 = JSON.parse(catTok);
    const catToken = catTok2.token;

    const catHead = new Headers();
    catHead.append("Authorization", `Bearer ${catToken}`);

    const reqCat = {
        method: 'GET',
        headers: catHead
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/get_details?category_id=` + `${getUnique}`;
    fetch(url, reqCat)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const myCatName = document.getElementById("updateName");
        myCatName.setAttribute('value', `${result.name}`);

        const myCatImageUrl = document.getElementById("updateNameImage");
        myCatImageUrl.setAttribute('value', `${result.image}`);
    })
    .catch(error => console.log('error', error));

    const getModal = document.getElementById("my-modal3");
    getModal.style.display = "block";
}


// function to close modal
function closeModal2() {
    const getModal = document.getElementById("my-modal");
    getModal.style.display = "none";
}

// function close close modal anywhere
window.onclick = function outsideClick(e) {
    const getModal = document.getElementById("my-modal");
    if (e.target == getModal) {
        getModal.style.display = "none";
    }
}

function closeModal() {
    const getModal = document.getElementById("my-modal2");
    getModal.style.display = "none";
}

function closeModal3() {
    const getModal = document.getElementById("my-modal3");
    getModal.style.display = "none";
}

// function close close modal anywhere
window.onclick = function outsideClick(e) {
    const getModal = document.getElementById("my-modal2");
    if (e.target == getModal) {
        getModal.style.display = "none";
    }
}

// function for updating category
function updateCategory(event) {
    event.preventDefault();

    const categoryName = document.getElementById("updateName").value;
    const categoryImageName = document.getElementById("updateNameImage").value;
    const categoryImage = document.getElementById("updateImage").files[0];

    if (categoryName === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const upToken = localStorage.getItem('loginData');
        const getUpToken = JSON.parse(upToken);
        const updateToken = getUpToken.token;

        const updateHeader = new Headers();
        updateHeader.append("Authorization", `Bearer ${updateToken}`);

        const updateData = new FormData();
        updateData.append("name", categoryName);
        updateData.append("image", categoryImageName);
        updateData.append("image", categoryImage);
        updateData.append("category_id", getUnique);

        const updateRequest = {
            method: 'POST',
            headers: updateHeader,
            body: updateData
        };

        console.log(getUnique);

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_category";

        fetch(url, updateRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Update Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }


}

// function to display name on details page
function getNameDetails() {
    const params2 = new URLSearchParams(window.location.search)
    let getName = params2.get('name');
    console.log(getName);

    const getDelName = document.querySelector(".det");
    getDelName.innerHTML = getName;
}

// Function for details page
function getDetails() {
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');

    const del = localStorage.getItem('loginData');
    const getDel = JSON.parse(del);
    const getTheDel = getDel.token;

    const delHeaders = new Headers();
    delHeaders.append("Authorization", `Bearer ${getTheDel}`);

    const delRequest = {
        method: 'GET',
        headers: delHeaders
    };

    let items = [];
    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/category_details/` + `${getId}`;

    fetch(url, delRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            items +=`
              <div class="col-sm-12 col-md-12 col-lg-6">
                <div class="box-img2">
                    <img src=${item.image}>
                    <p class="p-3">${item.name}</p>
                    <div class="text-center">
                        <button class="update-button" onclick="openSubModal(${item.id})">Update</buton>
                    </div>
                </div>
              </div> 
            `
            let info = document.querySelector(".row");
            info.innerHTML = items;
        })
    })
    .catch(error => console.log('error', error));
}

getDetails();

// Function for creating sub-category
function subCategory(event) {
    event.preventDefault();
    const getParams = new URLSearchParams(window.location.search);
    let id = getParams.get('id');

    const subToken = localStorage.getItem('loginData');
    const theSubToken = JSON.parse(subToken);
    const tokenSub = theSubToken.token;

    const subName = document.getElementById("subCatName").value;
    const subImage = document.getElementById("subCatImg").files[0];

    if (subName === "" || subImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const subHeaders = new Headers();
        subHeaders.append("Authorization", `Bearer ${tokenSub}`);

        const subData = new FormData();
        subData.append("name", subName);
        subData.append("image", subImage);
        subData.append("category_id", id);

        const subRequest = {
            method: 'POST',
            headers: subHeaders,
            body: subData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_subcategory";
        fetch(url, subRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'sub category created successfully',
                    confirmButtonColor: '#2D85DE'
                })
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }

}


let subId;
// Fuction for opening sub Modal
function openSubModal(theId) {
    localStorage.setItem("subLogin", theId);
    const subUnique = localStorage.getItem("subLogin");
    const sub = JSON.parse(subUnique);
    subId = sub;

    const getModal = document.getElementById("my-modal-mode");
    getModal.style.display = "block";

    
    const upd = localStorage.getItem("loginData");
    const upd2 = JSON.parse(upd);
    const upd3  = upd2.token;


    const updHead = new Headers();
    updHead.append("Authorization", `Bearer ${upd3}`);

    const updRequest = {
        method: 'GET',
        headers: updHead
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/get_details?subcategory_id=` + `${subId}`;
    fetch(url, updRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const changePlace = document.getElementById("updateSubName");
        changePlace.setAttribute('value', `${result.name}`);
    })
    .catch(error => console.log('error', error));
}

function closeModalMode() {
    const getModal = document.getElementById("my-modal-mode");
    getModal.style.display = "none";
}

// Function for updating subcategory
function updateSubCategory(event) {
    event.preventDefault();

    const categorySubName = document.getElementById("updateSubName").value;
    const categorySubImage = document.getElementById("updateSubImage").files[0];

    if (categorySubName === "" || categorySubImage === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        })
    }

    else {
        const subCaToken = localStorage.getItem('loginData');
        const getSubCaToken = JSON.parse(subCaToken);
        const getTheSubToken = getSubCaToken.token;

        const subCaHeaders = new Headers();
        subCaHeaders.append("Authorization", `Bearer ${getTheSubToken}`);

        const subCatData = new FormData();
        subCatData.append("name", categorySubName);
        subCatData.append("image", categorySubImage);
        subCatData.append("subcategory_id", subId);

        const subCatRequest ={
            method: 'POST',
            headers: subCaHeaders,
            body: subCatData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_subcategory";

        fetch(url, subCatRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                location.reload();
            }else {
                Swal.fire({
                    icon: 'info',
                    text: 'Update Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function for creating category list
function createCatList() {
    const drop = document.querySelector(".navList");
    const listCat = localStorage.getItem('loginData');
    const getListCat = JSON.parse(listCat);
    const CatList = getListCat.token;

    const theHeader = new Headers();
    theHeader.append("Authorization", `Bearer ${CatList}`);

    const forOptions = {
        method: 'GET',
        headers: theHeader
    };

    // let dropList = [];

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/categorylist_dropdown";

    fetch(url, forOptions)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        let navList = document.querySelector("#nav-list");
        result.forEach(element => {
            navList.innerHTML += `
            <li>
                <h5 class="parent">${element.parent_category.name}</h5>
                <ul class="sub-category-${element.parent_category.id}"></ul>
                <hr class="pine">
            <li>
            
            `;
            element.sub_category.forEach(category => {
            document.querySelector(`.sub-category-${category.parentcategory_id}`).innerHTML += `
                <li class="theLink">
                <a onclick="learningMat(${category.id})">${category.name}</a>
                </li>
            `;
            })
        })
    })
    .catch(error => console.log('error', error));
}

createCatList();

// function for creating learning materials
let globalId; // Global storage for sub_category
function learningMat(subId) {
    const getRec = document.querySelector(".overboard");
    const lean = localStorage.getItem('loginData');
    const leanMat = JSON.parse(lean);
    const getLean = leanMat.token;

    globalId = subId;
    console.log(globalId);


    const leanHeaders = new Headers();
    leanHeaders.append("Authorization", `Bearer ${getLean}`);

    const leanRequest = {
        method: 'GET',
        headers: leanHeaders
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/list_all_learning_materials?subcategory_id=`+subId;

    fetch(url, leanRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        getRec.innerHTML = " ";
        result.map((item) => {
            if (item.type === "default") {
                return getRec.innerHTML += `
                <div class="searchcard">
                <div class="searchcard-image">
                    <img src=${item.image_file}>
                </div>
                <div class="searchcard-info">
                    <h4 class="text-col">${item.title}</h4>
                    <audio controls>
                        <source src=${item.audio_file} type="audio/mp3">
                    </audio>
                    <button class="update-button" onclick="openDefault(${item.id})">Update</button>
                    <button class="delete-button" onclick="deleteDefault(${item.id})">Delete</buton>
                </div>
                </div>
            `
            }
            else if (item.type === "conversation") {
                return getRec.innerHTML += `
                <div class="searchcard">
                    <div class="searchcard-image">
                      <img src=${item.image_file}>
                    </div>
                    <div class="searchcard-info">
                      <hr>
                      <p><span class="clent">Ques:</span> ${item.conversation_english_question}</p>
                      <p><span class="clent">Ans:</span> ${item.conversation_english_answer}</p>
                      <hr>
                      <p><span class="clent">Ques:</span> ${item.conversation_yoruba_question}</p>
                      <p><span class="clent">Ans:</span> ${item.conversation_yoruba_answer}</p>
                      <hr>
                      <audio controls>
                        <source src=${item.conversation_audio_question_inyoruba} type="audio/mp3">
                      </audio>
                      <audio controls>
                        <source src=${item.conversation_audio_answer_inyoruba} type="audio/mp3">
                      </audio>
                      <button class="update-button" onclick="openConver(${item.id})">Update</button>
                      <button class="delete-button" onclick="deleteConver(${item.id})">Delete</buton>
                    </div>
                </div>
                `
            }
            
            else {
                return getRec.innerHTML += `
                <div class="searchcard">
                    <div class="searchcard-image">
                        <img src=${item.image_file}>
                    </div>
                    <div class="searchcard-info">
                        <p>${item.reading_word_in_english}</p>
                        <hr>
                        <p>${item.reading_word_in_yoruba}</p>
                        <audio controls>
                            <source src=${item.audio_file} type="audio/mp3">
                        </audio>
                        <button class="update-button" onclick="readingModal(${item.id})">Update</button>
                        <button class="delete-button" onclick="deleteRead(${item.id})">Delete</buton>
                    </div>
                </div>    
              `
            }
        })

    })
    .catch(error => console.log('error', error));
}

// function for displaying learning categories
function displayLearnModal() {
    const learnModal = document.getElementById("my-modal");
    learnModal.style.display = "block";
}

// function to switch through forms
const def = document.querySelector(".default");
const read = document.querySelector(".reading");
const conver = document.querySelector(".conversation");
const getDefault = document.querySelector(".myDefault");
const getReading = document.querySelector(".myReading");
const getConver = document.querySelector(".myConversation");
function reading() {
    getReading.style.display = "block";
    getDefault.style.display = "none";
    getConver.style.display = "none";
    read.style.backgroundColor = "#2D85DE";
    read.style.color = "#fff";
    def.style.backgroundColor = "#fff";
    def.style.border = "1px solid rgb(197, 196, 196)";
    def.style.color = "#2D85DE";
    conver.style.backgroundColor = "#fff";
    conver.style.border = "1px solid rgb(197, 196, 196)";
    conver.style.color = "#2D85DE";
}

function conversation() {
    getConver.style.display = "block";
    getDefault.style.display = "none";
    getReading.style.display = "none";
    conver.style.backgroundColor = "#2D85DE"
    conver.style.color = "#fff";
    def.style.backgroundColor = "#fff";
    def.style.color = "#2D85DE";
    def.style.border = "1px solid rgb(197, 196, 196)";
    read.style.backgroundColor = "#fff";
    read.style.color = "#2D85DE";
    read.style.border = "1px solid rgb(197, 196, 196)";
}

function defaultLearning() {
    getDefault.style.display = "block";
    getConver.style.display = "none";
    getReading.style.display = "none";
    def.style.backgroundColor = "#2D85DE";
    def.style.color = "#fff";
    read.style.backgroundColor = "#fff";
    read.style.color = "#2D85DE";
    read.style.border = "1px solid rgb(197, 196, 196)";
    conver.style.backgroundColor = "#fff";
    conver.style.border = "1px solid rgb(197, 196, 196)";
    conver.style.color = "#2D85DE";
}

// function to create default learning
function createDefaultLearning(event) {
    event.preventDefault();

    const getTitle = document.getElementById("title").value;
    const defImage = document.getElementById("img1").files[0];
    const defAudio = document.getElementById("audio").files[0];

    if (getTitle === "" || defImage === "" || defAudio === "") {
        Swal.fire({
            icon: "info",
            text: "All fields are required",
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        const defaultlog = localStorage.getItem("loginData");
        const getDefaultLog = JSON.parse(defaultlog);
        const defaultLogItem = getDefaultLog.token;

        console.log(globalId);

        const defHeaders = new Headers();
        defHeaders.append("Authorization", `Bearer ${defaultLogItem}`);

        const defData = new FormData();
        defData.append("title", getTitle);
        defData.append("image", defImage);
        defData.append("audio", defAudio);
        defData.append("subcategory_id", globalId);

        const defRequest = {
            method: 'POST',
            headers: defHeaders,
            body: defData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_defaultlearning";
        fetch(url, defRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                location.reload();
            }else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function for creating reading materials
function createReadingMat(event) {
    event.preventDefault();

    const getEnglishText = document.getElementById("englishText").value;
    const getYorubaText = document.getElementById("yorubaText").value;
    const getTheImage = document.getElementById("img2").files[0];
    const getTheAudio = document.getElementById("audio2").files[0];

    if (getEnglishText === "" || getYorubaText === "" || getTheImage === "" || getTheAudio === "") {
        Swal.fire({
            icon: 'info',
            text: "All fields are required",
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const theRead = localStorage.getItem("loginData");
        const readIt = JSON.parse(theRead);
        const readToken = readIt.token;

        const readHeaders = new Headers();
        readHeaders.append("Authorization", `Bearer ${readToken}`);

        const readData = new FormData();
        readData.append("words_in_english", getEnglishText);
        readData.append("words_in_yoruba", getYorubaText);
        readData.append("image", getTheImage);
        readData.append("audio", getTheAudio);
        readData.append("subcategory_id", globalId);

        const readRequest = {
            method: 'POST',
            headers: readHeaders,
            body: readData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_readingmaterial";
        fetch(url, readRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }

        })
        .catch(error => console.log('error', error));
    }
}

// Function for creating conversation
function createConversation(event) {
    event.preventDefault();

    const getEnglish = document.getElementById("englishQues").value;
    const getYoruba = document.getElementById("yorubaQues").value;
    const getEnglishAns = document.getElementById("englishAns").value;
    const getYorubaAns = document.getElementById("yorubaAns").value;
    const getYorubaAudioQues = document.getElementById("audio3").files[0];
    const getYorubaAudioAns = document.getElementById("audio4").files[0];
    const getConverImage = document.getElementById("img3").files[0];

    if (getEnglish === "" || getYoruba === "" || getEnglishAns === "" || getYorubaAns === "" || getYorubaAudioQues === "" || getYorubaAudioAns === "" || getConverImage == "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required...',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const converItem = localStorage.getItem("loginData");
        const getConverItem = JSON.parse(converItem);
        const getConverTok = getConverItem.token;

        const getHeaders = new Headers();
        getHeaders.append("Authorization", `Bearer ${getConverTok}`);

        const converData = new FormData();
        converData.append("conversation_english_question", getEnglish);
        converData.append("conversation_yoruba_question", getYoruba);
        converData.append("conversation_english_answer", getEnglishAns);
        converData.append("conversation_yoruba_answer", getYorubaAns);
        converData.append("conversation_audio_question_inyoruba", getYorubaAudioQues);
        converData.append("conversation_audio_answer_inyoruba", getYorubaAudioAns);
        converData.append("image", getConverImage);
        converData.append("subcategory_id", globalId);


        const converRequest = {
            method: 'POST',
            headers: getHeaders,
            body: converData
        };
    
        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_learningconversation";
        fetch(url, converRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function update default
let defId;
function openDefault(defaultId) {
    localStorage.setItem("defaultLogin", defaultId);
    const idDef = localStorage.getItem("defaultLogin");
    const getDef = JSON.parse(idDef);
    defId = getDef;

    const defTitle = localStorage.getItem("loginData");
    const title2 = JSON.parse(defTitle);
    const titleToken = title2.token;

    const titleHead = new Headers();
    titleHead.append("Authorization", `Bearer ${titleToken}`);

    const titleReq = {
        method: 'GET',
        headers: titleHead
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/get_details?material_id=` + `${defId}`;
    fetch(url, titleReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const titleShow = document.getElementById("updateDefTitle");
        titleShow.setAttribute('value', `${result.title}`);
    })
    .catch(error => console.log('error', error));

    const getMyModal = document.getElementById("my-modal2");
    getMyModal.style.display = "block";
}

function createUpdateDefault(event) {
    event.preventDefault();

    const detTitle = document.getElementById("updateDefTitle").value;
    const detImage = document.getElementById("updateDefImage").files[0];
    const detAudio = document.getElementById("updateDefAudio").files[0];

    if (detTitle === "" || detImage === "" || detAudio === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }

    else {
        const updateStorage = localStorage.getItem("loginData");
        const theStorageUpdate = JSON.parse(updateStorage);
        const getTheUpStorage = theStorageUpdate.token;

        const updateStorageHead = new Headers();
        updateStorageHead.append("Authorization", `Bearer ${getTheUpStorage}`);

        const updateStoreData = new FormData();
        updateStoreData.append("title", detTitle);
        updateStoreData.append("image", detImage);
        updateStoreData.append("audio", detAudio);
        updateStoreData.append("learning_material_id", defId);

        const updateStoreRequest = {
            method: 'POST',
            headers: updateStorageHead,
            body: updateStoreData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_defaultlearning";
        fetch(url, updateStoreRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                location.reload();
            }else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function for creating conversation
let conversationId;
function openConver(conId) {
    localStorage.setItem("converLogin", conId);
    const getCon = localStorage.getItem("converLogin");
    const conGet = JSON.parse(getCon);
    conversationId = conGet;
    console.log(conversationId);

    const converModal = document.getElementById("conver-modal");
    converModal.style.display = "block";
}

function closeMyModal() {
    const getModal = document.getElementById("conver-modal");
    getModal.style.display = "none";
}

// Function update Conversation category
function createConversationUpdate(event) {
    event.preventDefault();

    const theEngQues = document.getElementById("engques").value;
    const theYouQues = document.getElementById("youques").value;
    const theEngAns = document.getElementById("engans").value;
    const theYouAns = document.getElementById("youans").value;
    const youAudioQue = document.getElementById("youAudioQues").files[0];
    const youAudioAns = document.getElementById("youAudioAns").files[0];
    const updateTheCover = document.getElementById("updateConverImage").files[0];

    if (theEngQues === "" || theYouQues === "" || theEngAns === "" || theYouAns === "" || youAudioQue === "" || youAudioAns === "" || updateTheCover === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const converUpdate = localStorage.getItem("loginData");
        const getConverUpdate = JSON.parse(converUpdate);
        const updateConver = getConverUpdate.token;

        const converHeader = new Headers();
        converHeader.append("Authorization", `Bearer ${updateConver}`);

        const converDataItem = new FormData();
        converDataItem.append("conversation_english_question", theEngQues);
        converDataItem.append("conversation_yoruba_question", theYouQues);
        converDataItem.append("conversation_english_answer", theEngAns);
        converDataItem.append("conversation_yoruba_answer", theYouAns);
        converDataItem.append("conversation_audio_question_inyoruba", youAudioQue);
        converDataItem.append("conversation_audio_answer_inyoruba", youAudioAns);
        converDataItem.append("image", updateTheCover);
        converDataItem.append("learning_material_id", conversationId);

        const coverTheRequest = {
            method: 'POST',
            headers: converHeader,
            body: converDataItem
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_learningconversation";
        fetch(url, coverTheRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function for getting reading materials
let readId;
function  readingModal(reId) {
    localStorage.setItem("readLogin", reId);
    const readItem = localStorage.getItem("readLogin");
    const getReadItem = JSON.parse(readItem);
    readId = getReadItem;
    console.log(readId);

    const readMod = document.getElementById("reading-modal");
    readMod.style.display = "block";
}

// function for closing reading modal
function closeReadModal() {
    const remodal = document.getElementById("reading-modal");
    remodal.style.display = "none";
}

// Function for updating reading material
function createUpdateReading(event) {
    event.preventDefault();

    const readTheEng = document.getElementById("readEng").value;
    const readTheYou = document.getElementById("readYou").value;
    const readTheImage = document.getElementById("readImg").files[0];
    const readTheAudio = document.getElementById("updateReadAudio").files[0];

    if (readTheEng === "" || readTheYou === "" || readTheImage === "" || readTheAudio === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const getRead = localStorage.getItem("loginData");
        const getTheRead = JSON.parse(getRead);
        const readTok = getTheRead.token;

        const readMyHeader = new Headers();
        readMyHeader.append("Authorization", `Bearer ${readTok}`);

        const readMyData = new FormData();
        readMyData.append("words_in_english", readTheEng);
        readMyData.append("words_in_yoruba", readTheYou);
        readMyData.append("image", readTheImage);
        readMyData.append("audio", readTheAudio);
        readMyData.append("learning_material_id", readId);

        const readMyRequest = {
            method: 'POST',
            headers: readMyHeader,
            body: readMyData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_readingmaterial";

        fetch(url, readMyRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                location.reload();
            }
            else {
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// Function for deleting default
function deleteDefault(myDefaultId) {
    const def1 = localStorage.getItem("loginData");
    const def2 = JSON.parse(def1);
    const def3 = def2.token;

    const defaultHeader = new Headers();
    defaultHeader.append("Authorization", `Bearer ${def3}`);

    const defaultReq = {
        method: 'GET',
        headers: defaultHeader
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_material/` + `${myDefaultId}`;

    fetch(url, defaultReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: 'Record deleted successfully',
                confirmButtonColor: '#2D85DE'
            })
        }
        setTimeout(()=> {
            location.reload();
        }, 5000);
    })
    .catch(error => console.log('error', error));
}

// Function for deleting Conversation category
function deleteConver(myConversationId) {
    const conver1 = localStorage.getItem("loginData");
    const conver2 = JSON.parse(conver1);
    const conver3 = conver2.token;

    const converHeaderItem = new Headers();
    converHeaderItem.append("Authorization", `Bearer ${conver3}`);

    const converReq = {
        method: 'GET',
        headers: converHeaderItem
    }

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_material/` + `${myConversationId}`;

    fetch(url, converReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: 'Record deleted successfully',
                confirmButtonColor: '#2D85DE'
            })
        }
        setTimeout(()=> {
            location.reload();
        }, 5000);
    })
    .catch(error => console.log('error', error));
}

// Function for deleting reading materials
function deleteRead(readId) {
    const read1 = localStorage.getItem("loginData");
    const read2 = JSON.parse(read1);
    const read3 = read2.token;

    const readHeaderItem = new Headers();
    readHeaderItem.append("Authorization", `Bearer ${read3}`);

    const readReq = {
        method: 'GET',
        headers: readHeaderItem
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_material/` + `${readId}`;

    fetch(url, readReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)

        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: 'Record deleted successfully',
                confirmButtonColor: '#2D85DE'
            })
        }
        setTimeout(()=> {
            location.reload();
        }, 5000);
    })
    .catch(error => console.log('error', error));
}

// function for creating Quiz dropdown
function quizDrop() {
    const quiz1 = localStorage.getItem("loginData");
    const quiz2 = JSON.parse(quiz1);
    const quiz3 = quiz2.token;

    const quizHeader = new Headers();
    quizHeader.append("Authorization", `Bearer ${quiz3}`);

    const quizReq = {
        method: 'GET',
        headers: quizHeader
    };

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/categorylist_dropdown";

    fetch(url, quizReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        let navList = document.querySelector(".scroll-ait2");
        result.forEach(element => {
            navList.innerHTML += `
            <li>
                <h5 class="parent">${element.parent_category.name}</h5>
                <ul class="sub-category-${element.parent_category.id}"></ul>
                <hr class="pine">
            <li>
            
            `;
            element.sub_category.forEach(category => {
            document.querySelector(`.sub-category-${category.parentcategory_id}`).innerHTML += `
                <li class="theLink">
                <a onclick="getQuizDrop(${category.id})">${category.name}</a>
                </li>
            `;
            })
        })
    })
    .catch(error => console.log('error', error));
}

quizDrop();



// function for displaying quiz modal
function displayQuizModal() {
    const quizMod = document.getElementById("my-modal4");
    quizMod.style.display = "block";
}

function closeModal4() {
    const getModal = document.getElementById("my-modal4");
    getModal.style.display = "none";
}

// Function for getting quiz categories
function getQuizDrop(quizId) {
    const it1 = localStorage.getItem("loginData");
    const it2 = JSON.parse(it1);
    const it3 = it2.token;

    localStorage.setItem("quizData", quizId);
    const getItem = localStorage.getItem("quizData");
    const getItem2 = JSON.parse(getItem);
    const getItemId = getItem2;

    const itHeader = new Headers();
    itHeader.append("Authorization", `Bearer ${it3}`);


    const itRequest = {
        method: 'GET',
        headers: itHeader
    };

    let qzi = [];
    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/getcategory_quize/` + `${getItemId}`;
    fetch(url, itRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result?.map((item) => {
            qzi +=`
            <div class="box-img">
                <img src=${item.image}>
                <p class="mimipara"><span class="clent">English Ques:</span>${item.question_in_english}</p>
                <p class="mimipara"><span class="clent">Yoruba Ques:</span>${item.question_in_yoruba}</p>
                <p class="mimipara"><span class="clent">Yoruba Answer:</span>${item.answer_in_yoruba}</p>
                <hr>
                <p class="text-center">Options</p>
                <div class="box-option">
                  <div class="optionItem">${item.options[0]}</div>
                  <div class="optionItem">${item.options[1]}</div>
                  <div class="optionItem">${item.options[2]}</div>
                  <div class="optionItem">${item.options[3]}</div>
                </div>
                <hr>
                <div class="text-center">
                  <button class="update-button" onclick="modalQuizItem(${item.id})">Update</buton>
                  <button class="delete-button" onclick="deleteQuiz(${item.id})">Delete</buton>
                </div>  
            </div>   
            `
            const quizBoard = document.querySelector(".overQuiz");
            quizBoard.innerHTML = qzi;
        })

    })
    .catch(error => console.log('error', error));
}

// Function for displaying quiz options
function showOptions() {
    const checkBox = document.querySelector(".myCheck")
    const getTheOption = document.querySelector(".boxInput");
    if (checkBox.checked) {
        getTheOption.style.display = "block";
    }else {
        getTheOption.style.display = "none";
    }
}

//Function to create the quiz and pass the unique id
function createQuizItem(event) {
    event.preventDefault();
    const quizEngQues = document.getElementById("engquesquiz").value;
    const quizYouQues = document.getElementById("youquesquiz").value;
    const quizYouAns = document.getElementById("ansYou").value;
    const first = document.getElementById("firstOption").value;
    const second = document.getElementById("secondOption").value;
    const third = document.getElementById("thirdOption").value;
    const fourth = document.getElementById("fourthOption").value;

    const quizImage = document.getElementById("quizImg").files[0];

    if (quizEngQues === "" || quizYouQues === "" || quizYouAns === "" || quizImage === "" || first === "" || second === "" || third === "" || fourth === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }
    else {
        const myQuiz1 = localStorage.getItem("loginData");
        const myQuiz2 = JSON.parse(myQuiz1);
        const myQuiz3 = myQuiz2.token;


        const quizInfo = localStorage.getItem("quizData");
        const quizInfo2 = JSON.parse(quizInfo);
        const quizInfo3 = quizInfo2;

        const myQuizHeader = new Headers();
        myQuizHeader.append("Authorization", `Bearer ${myQuiz3}`);

        const quizData = new FormData();
        quizData.append("question_in_english", quizEngQues);
        quizData.append("question_in_yoruba", quizYouQues);
        quizData.append("answer_in_yoruba", quizYouAns);
        quizData.append("options[]", first);
        quizData.append("options[]", second);
        quizData.append("options[]", third);
        quizData.append("options[]", fourth);
        quizData.append("image", quizImage);
        quizData.append("subcategory_id", quizInfo3);

        const quizRequest = {
            method: 'POST',
            headers: myQuizHeader,
            body: quizData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/create_quize";
        fetch(url, quizRequest)
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: 'Successful...',
                    confirmButtonColor: '#2D85DE'
                })
            }
            // setTimeout(()=> {
            //     location.reload();
            // }, 5000);
        })
        .catch(error => console.log('error', error));
    }

}


// Function for opening modal form and getting the quiz id
let quId;
function modalQuizItem(qId) {
    localStorage.setItem("upQuiz", qId);
    const getUp = localStorage.getItem("upQuiz");
    const getUp2 = JSON.parse(getUp);
    quId = getUp2;

    const quizTitle = localStorage.getItem("loginData");
    const quizTitle2 = JSON.parse(quizTitle);
    const titleQuix = quizTitle2.token;

    const qheader = new Headers();
    qheader.append("Authorization", `Bearer ${titleQuix}`);

    const reqQuiz = {
        method: 'GET',
        headers: qheader
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/get_details?quiz_id=` + `${quId}`;
    fetch(url, reqQuiz)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const q1 = document.getElementById("upengquesquiz");
        const q2 = document.getElementById("upyouquesquiz");
        const q3 = document.getElementById("upansYou");
        const q4 = document.getElementById("fOption");
        const q5 = document.getElementById("sOption");
        const q6 = document.getElementById("t0ption");
        const q7 = document.getElementById("foOption");

        q1.setAttribute('value', `${result.question_in_english}`);
        q2.setAttribute('value', `${result.question_in_yoruba}`);
        q3.setAttribute('value', `${result.answer_in_yoruba}`);
        q4.setAttribute('value', `${result.options[0]}`);
        q5.setAttribute('value', `${result.options[1]}`);
        q6.setAttribute('value', `${result.options[2]}`);
        q7.setAttribute('value', `${result.options[3]}`);
    })
    .catch(error => console.log('error', error));

    const quizOpen = document.getElementById("my-modal5");
    quizOpen.style.display = "block";
}

function closeModal5() {
    const getModal = document.getElementById("my-modal5");
    getModal.style.display = "none";
}

// Function for displaying quiz options
function showOptions2() {
    const checkBox = document.querySelector(".myCheck2")
    const getTheOption = document.querySelector(".boxInput2");
    if (checkBox.checked) {
        getTheOption.style.display = "block";
    }else {
        getTheOption.style.display = "none";
    }
}

// Function for getting the quiz id and updating the quiz
function updateMyQuiz(event) {
    event.preventDefault();

    const up1 = document.getElementById("upengquesquiz").value;
    const up2 = document.getElementById("upyouquesquiz").value;
    const up3 = document.getElementById("upansYou").value;
    const fO = document.getElementById("fOption").value;
    const sO = document.getElementById("sOption").value;
    const tO = document.getElementById("t0ption").value;
    const foO = document.getElementById("foOption").value;
    const up4 = document.getElementById("upquizImg").files[0];

    if (up1 === "" || up2 === "" || up3 === "" || up4 === "" || fO === "" || sO === "" || tO === "" || foO === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
    }

    else {
        const upendi = localStorage.getItem("loginData");
        const upendi2 = JSON.parse(upendi);
        const upendi3 = upendi2.token;

        const upHeader = new Headers();
        upHeader.append("Authorization", `Bearer ${upendi3}`);

        // const upOpt = [fO, sO, tO, foO];

        const upData = new FormData();
        upData.append("question_in_english", up1);
        upData.append("question_in_yoruba", up2);
        upData.append("answer_in_yoruba", up3);
        upData.append("options[]", fO);
        upData.append("options[]", sO);
        upData.append("options[]", tO);
        upData.append("options[]", foO);
        upData.append("image", up4);
        upData.append("quize_id", quId);

        const upReq = {
            method: 'POST',
            headers: upHeader,
            body: upData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/update_quize";
        fetch(url, upReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
            }

            setTimeout(()=> {
                location.reload();
            }, 5000);
        })
        .catch(error => console.log('error', error));
    }

}

// Function for deleting quiz by id
function deleteQuiz(deId) {
    const del1 = localStorage.getItem("loginData");
    const del2 = JSON.parse(del1);
    const del3 = del2.token;

    const deleHeader = new Headers();
    deleHeader.append("Authorization", `Bearer ${del3}`);

    const delReq = {
        method: 'GET',
        headers: deleHeader
    };

    const url = `https://codesandbox.com.ng/yorubalearning/api/admin/delete_quize/` + `${deId}`;
    fetch(url, delReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: `${result.message}`,
                confirmButtonColor: '#2D85DE'
            })
        }

        setTimeout(()=> {
            location.reload();
        }, 5000);
    })
    .catch(error => console.log('error', error));
}

// Function for Admin dashboard api
function dashBoard() {
    const getCategory = document.getElementById("category");
    const getLearning = document.getElementById("learnmat");
    const getSubCat = document.getElementById("subCat");
    const getQuiz = document.getElementById("quiz");
    const getStudent = document.getElementById("student");
    const getAdmin = document.getElementById("adminId");

    const dash = localStorage.getItem("loginData");
    const dash2 = JSON.parse(dash);
    const dash3 = dash2.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${dash3}`);

    const dashRequest = {
        method: 'GET',
        headers: dashHeader
    };

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/admin_dashboardapi";
    fetch(url, dashRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        getCategory.innerHTML = result.total_number_of_categories;
        getLearning.innerHTML = result.total_number_of_learningmaterial;
        getSubCat.innerHTML = result.total_number_of_subcategories;
        getQuiz.innerHTML = result.total_number_of_quize;
        getStudent.innerHTML = result.total_number_of_students;
        getAdmin.innerHTML = result.admin_name;
    })
    .catch(error => console.log('error', error));
}
dashBoard();

// Function to get all students
function getAllStudents() {
    const get1 = localStorage.getItem("loginData");
    const get2 = JSON.parse(get1);
    const get3 = get2.token;

    const getHead = new Headers();
    getHead.append("Authorization", `Bearer ${get3}`);

    const getAllReq = {
        method: 'GET',
        headers: getHead
    }

    let dataItem = [];

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/get_all_students";
    fetch(url, getAllReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result.map((item)=> {
            dataItem += 
            `
                <tr>
                   <td>${item.name}</td>
                   <td>${item.email}</td>
                   <td>${item.phone_number}</td>
                   <td>${item.position}</td>
                   <td>${item.total_score}</td>
                </tr>
            `
            const getTableId = document.getElementById("table-id");
            getTableId.innerHTML = dataItem;
        })

    })
    .catch(error => console.log('error', error));
}
getAllStudents();

// Function to get top three students
function getTopThreeStudents() {
    const top1 = localStorage.getItem("loginData");
    const top2 = JSON.parse(top1);
    const top3 = top2.token;

    const topHeaders = new Headers();
    topHeaders.append("Authorization", `Bearer ${top3}`);

    const topReq = {
        method: 'GET',
        headers: topHeaders
    };

    let dataItem = [];

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/top_three_students";
    fetch(url, topReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        result.map((item) => {
            dataItem += 
            `<div class="student-card">
              <p><span class="clent">Name</span>: <span class="swichItem">${item.name}</span></p>
              <p><span class="clent">Email</span>: <span class="swichItem">${item.email}</span></p>
              <p><span class="clent">Phone</span>: <span class="swichItem">${item.phone_number}</span></p>
              <p><span class="clent">Position</span>: <span class="swichItem">${item.position}</span></p>
              <p><span class="clent">Score</span>: <span class="swichItem">${item.total_score}</span></p>
            </div>
            `
            const allStud = document.querySelector(".allstudent");
            allStud.innerHTML = dataItem;
        })
    })
    .catch(error => console.log('error', error));
}

getTopThreeStudents();

// Function open top student modal
function studentModal(event) {
    const modalStudent = document.getElementById("dash-modal");
    modalStudent.style.display = "block";
}

// Function close top student modal
function closeDashModal() {
    const getModalStudent = document.getElementById("dash-modal");
    getModalStudent.style.display = "none";
}

// Function to update admin profile


function upDateAdmin(event) {
    event.preventDefault();
    const adminName = document.getElementById("updateName").value;
    const adminEmail = document.getElementById("updateEmail").value;

    if (adminName === "" || adminEmail === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        });
    }
    else {
        const admin1 = localStorage.getItem("loginData");
        const admin2 = JSON.parse(admin1);
        const admin3 = admin2.token;

        const adminHeader = new Headers();
        adminHeader.append("Authorization", `Bearer ${admin3}`);

        const adminData = new FormData();
        adminData.append("name", adminName);
        adminData.append("email", adminEmail);

        const adminReq = {
            method: 'POST',
            headers: adminHeader,
            body: adminData
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/admin_update_profile";
        fetch(url, adminReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if(result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
            }

            setTimeout(()=> {
                window.location.href = "index.html";
            }, 5000);
        })
        .catch(error => console.log('error', error));
    }
}

// Function for updating password
function upDatePassword(event) {
    event.preventDefault();

    const mailUpdate = document.getElementById("updatePassEmail").value;
    const passUpdate = document.getElementById("updatePassword").value;
    const confirmUpdate = document.getElementById("confirmPassword").value;

    if (mailUpdate === "" || passUpdate === "" || confirmUpdate === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        });
    }

    if (confirmUpdate !== passUpdate) {
        Swal.fire({
            icon: 'warning',
            text: 'Passwords do not match!',
            confirmButtonColor: '#2D85DE'
        })
    }

    else {
        const pass1 = localStorage.getItem("loginData");
        const pass2 = JSON.parse(pass1);
        const pass3 = pass2.token;

        const upHead = new Headers();
        upHead.append("Authorization", `Bearer ${pass3}`);

        const upDataItem = new FormData();
        upDataItem.append("email", mailUpdate);
        upDataItem.append("password", passUpdate);
        upDataItem.append("password_confirmation", confirmUpdate);

        const passReq = {
            method: 'POST',
            headers: upHead,
            body: upDataItem
        };

        const url = "https://codesandbox.com.ng/yorubalearning/api/admin/admin_update_password";

        fetch(url, passReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
            }

            setTimeout(()=> {
                window.location.href = "index.html";
            }, 5000);
        })
        .catch(error => console.log('error', error));
    }
}

// function interchange image
function chooseImg() {
    const myWrapp = document.querySelector(".wrapper");
    const getWrap = document.querySelector(".getWrapp");

    myWrapp.style.display = "block";
    getWrap.style.display = "none";
}

// Function for logout
function logout() {
    const log = localStorage.getItem("loginData");
    const log2 = JSON.parse(log);
    const log3 = log2.token;

    const logHeader = new Headers();
    logHeader.append("Authorization", `Bearer ${log3}`);

    const logRequest = {
        method: 'GET',
        headers: logHeader
    };

    const url = "https://codesandbox.com.ng/yorubalearning/api/admin/logout";
    fetch(url, logRequest)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.message === "success") {
            window.location.href = "index.html"
        }
        else {
            Swal.fire({
                icon: 'info',
                text: 'logout unsuccessful',
                confirmButtonColor: '#2D85DE'
            })
        }
    })
    .catch(error => console.log('error', error));
}

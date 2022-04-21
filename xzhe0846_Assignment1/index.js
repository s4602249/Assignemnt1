function getJsonObject(path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

window.onload = function () {
    bookList = []; // book list container
    getJsonObject('data.json',
        function (data) {
            bookList = data; // store the book list into bookList
            // console.log(bookList); // print it into console (developer tools)
            // console.log(bookList[0].authors); // print the first book object into console 
            // here you can call methods to load or refresh the page 
            // loadBooks() or refreshPage()
            loadBooks("", "");
            // console.log(tableBody);
            document.getElementById("tableBody").innerHTML += tableBody;

            //checkbox each time only can select one
            check_the_box();


        },
        function (xhr) { console.error(xhr); }
    );


    //search books based on title
    document.getElementById("searchButton").addEventListener("click", function () {
        var txt = document.getElementById("search").value;
        //var value_index = document.getElementById("select_id").selectedIndex; //get the selected index
        //var category=document.getElementById("select_id").options[value_index].value;
        //console.log("11111");
        for (var i = 0; i < bookList.length; i++) {
            document.getElementById("tbodyid" + i).style.background = "none";//clear css style when search again
        }
        loadBooks(txt, "");
    });



    //filter books with category
    document.getElementById("filterButton").addEventListener("click", function () {
        //var txt = document.getElementById("search").value;
        var value_index = document.getElementById("select_id").selectedIndex; //get the selected index
        //console.log(value_index);
        var category = document.getElementById("select_id").options[value_index].value;

        for (var i = 0; i < bookList.length; i++) { //clear css style when filter again
            document.getElementById("tbodyid" + i).style.display = "";
        }
        loadBooks("", category);
    });

    //add to shopping cart
    document.getElementById("add").addEventListener("click", function () {
        //when click add, you must make sure you have checked item
        var check_boxs = document.getElementsByName("check_box"); //get all check items
        for (var i = 0; i < check_boxs.length; i++) {
            if (check_boxs[i].checked == true) {
                //console.log(check_boxs[i]);

                /*add num to cart*/
                var num_of_items = 0;
                var num = prompt("Please enter the quantity");

                //error handling
                if(num === null||num.length==0){
                    num = 0;
                }
                if (num < 0) {
                    num = 0;
                    window.alert("Quantity cannot be negative");
                }

                if (isNaN(Number(num))) {
                    num = 0;
                    window.alert("Invalid number");
                }

                if (!isInteger(num)) {
                    num = 0;
                    window.alert("Cannot be decimals");
                }

                num_of_items = parseInt(num);
                //add together

                document.getElementById("num_of_cart").innerText =
                    parseInt(document.getElementById("num_of_cart").innerText) + num_of_items;
                //console.log(num_of_items);

                //clear checkbox
                check_boxs[i].checked = false;

            }
        }

    });
    //reset function
    reset_cart();

    //switch mode
    toggle_mode();

}


/*2 parameters for search and filter*/
function loadBooks(txt, category) {

    tableBody = '';
    for (var i = 0; i < bookList.length; i++) {
        a = '<tbody id=tbodyid' + i + '>';
        a += '<td class="table_field1" id=first_td' + i + '>';
        // a+=bookList[i].img;//<img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600">
        a += '<input type="checkbox" name="check_box" class="checkbox_style" id=checkid' + i + '>';
        a += '<img class="thumbnail" src="' + bookList[i].img + '">';
        a += '<p class="titleInside" id=book_title' + i + '>' + bookList[i].title + '</p>';
        a += '</td>';

        a += '<td class="table_field2">';
        for (var j = 0; j < bookList[i].rating; j++) {
            a += '<img  class="img_to_left" src="/images/star-16.ico" >';
        }
        for (var j = 0; j < 5 - bookList[i].rating; j++) {
            a += '<img  class="img_to_left" src="/images/outline-star-16.ico">';
        }
        a += '</td>';

        a += '<td class="table_field">';
        a += '<p>' + bookList[i].authors + '</p>';
        a += '</td>';

        a += '<td class="table_field">';
        a += '<p>' + bookList[i].year + '</p>';
        a += '</td>';

        a += '<td class="table_field">';
        a += '<p>' + bookList[i].price + '</p>';
        a += '</td>';

        a += '<td>';
        a += '<p>' + bookList[i].publisher + '<p>';
        a += '</td>';

        a += '<td class="table_field" id=book_category' + i + '>';
        a += '<p>' + bookList[i].category + '<p>';
        a += '</td>';

        a += '</tbody>';
        tableBody += a;
    }


    /*hight light for selected items*/
    if (txt != null && txt != "") {
        var row = document.getElementsByTagName("tbody");

        for (var i = 0; i < row.length; i++) {

            if (document.getElementById("book_title" + i).innerText.toLowerCase().includes(txt.toLowerCase())) {
                document.getElementById("tbodyid" + i).style.background = "rgb(211, 211, 236)";
            }
        }

    }

    /*hide for filter*/
    if (category != null && category != "") {
        var row = document.getElementsByTagName("tbody");


        for (var i = 0; i < row.length; i++) {
            //console.log(document.getElementById("book_category" + i).innerText.toLowerCase());
            if (document.getElementById("book_category" + i).innerText.toLowerCase() != category.toLowerCase()) {
                document.getElementById("tbodyid" + i).style.display = "none";
            }

        }
        if (category == "All Categories") {
            for (var i = 0; i < row.length; i++) {
                //console.log(document.getElementById("book_category" + i).innerText.toLowerCase());
                document.getElementById("tbodyid" + i).style.display = "";
            }
        }

    }
}

/*function for checkbox*/
function check_the_box() {
    var check_boxs = document.getElementsByName("check_box");
    //var checked_res=[];

    for (var i = 0; i < check_boxs.length; i++) {
        //checked_res[i]=true;
        check_boxs[i].addEventListener("click", function () {
            for (var i = 0; i < check_boxs.length; i++) {
                if (this != check_boxs[i]) {
                    check_boxs[i].checked = false;
                }
            }
        });

    }
}

function reset_cart() {
    document.getElementById("reset").addEventListener("click", function () {
        if (window.confirm("Are you sure to reset the cart?")) {
            document.getElementById("num_of_cart").innerText = 0;
        }
    });
}

function toggle_mode() {
    var check = false;
    document.getElementById("toggle").addEventListener("click", function () {
        if (!check) {
            document.getElementById("background_mode").setAttribute("class", "toggle_mode");
            var all_p_tag = document.getElementsByTagName("p");
            for (var i = 0; i < all_p_tag.length; i++) {
                all_p_tag[i].classList.add("p_toogle");
            }
        }
        else {
            document.getElementById("background_mode").setAttribute("class", "");
            var all_p_tag = document.getElementsByTagName("p");
            for (var i = 0; i < all_p_tag.length; i++) {
                all_p_tag[i].classList.remove("p_toogle");
            }
        }
        check = !check;
    });

}

function isInteger(obj) { //if num is int
    return obj % 1 === 0
}
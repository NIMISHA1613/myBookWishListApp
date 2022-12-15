import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";
const $$ = Dom7;

let iDontNeedThisClick = async (id) => {
  document.getElementById(id).classList.add("red-card");
  setTimeout(async function () {
    const sUser = firebase.auth().currentUser.uid;
    let response = await firebase
      .database()
      .ref("books/" + sUser + "/" + id)
      .remove();
    console.log(response);
  }, 200);
};

let strikeOffClick = (id) => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const sUser = firebase.auth().currentUser.uid;
  firebase
    .database()
    .ref("books/" + sUser + "/" + id)
    .update({
      datePurchased: today.toDateString(),
    });
};

$$("#tab2").on("tab:show", () => {
  //put in firebase ref here
  const sUser = firebase.auth().currentUser.uid;
  firebase
    .database()
    .ref("books/" + sUser)
    .on("value", (snapshot) => {
      const oItems = snapshot.val();
      const aKeys = oItems ? Object.keys(oItems) : [];

      $$("#bookList").html("");
      for (let n = 0; n < aKeys.length; n++) {
        let sCard = `
            <div id="${aKeys[n]}" class="card  ${
          oItems[aKeys[n]].datePurchased ? "green-card" : ""
        } ">
            <div class="card-content card-content-padding large-font ${
              oItems[aKeys[n]].datePurchased ? "strike-through" : ""
            }">Book Name: ${oItems[aKeys[n]].item}
            </div>
            <div class="card-content card-content-padding">
            ${
              oItems[aKeys[n]].image == null || oItems[aKeys[n]].image == ""
                ? ""
                : "<img src='" +
                  oItems[aKeys[n]].image +
                  "' width=200 height=200 />"
            }
            </div>
            <div class="card-content card-content-padding"> Author: ${
              oItems[aKeys[n]].author
            }
              </div>
              <div class="card-content card-content-padding"> Genre: ${
                oItems[aKeys[n]].genre
              }
              </div>  
              <div class="card-content card-content-padding"> Date of Purchase: 
              ${
                oItems[aKeys[n]].datePurchased == null ||
                oItems[aKeys[n]].datePurchased == ""
                  ? ""
                  : oItems[aKeys[n]].datePurchased
              }
              </div>      
            <div class="button">
           <button class = "button button-raised" id="addButton_${
             aKeys[n]
           }">I bought this</button>
            <button id="remove_${
              aKeys[n]
            }" class = "button button-raised">I don't need this</button></div>
            `;
        $$("#bookList").append(sCard);
        document
          .getElementById("remove_" + aKeys[n])
          .addEventListener("click", (event, item = aKeys[n]) =>
            iDontNeedThisClick(item)
          );

        document
          .getElementById("addButton_" + aKeys[n])
          .addEventListener("click", (event, item = aKeys[n]) =>
            strikeOffClick(item)
          );
      }
    });
});

$$(".my-sheet").on("submit", (e) => {
  //submitting a new note
  e.preventDefault();
  const oData = app.form.convertToData("#addItem");
  const sUser = firebase.auth().currentUser.uid;
  const sId = new Date().toISOString().replace(".", "_");
  firebase
    .database()
    .ref("books/" + sUser + "/" + sId)
    .set(oData);
  app.sheet.close(".my-sheet", true);
});

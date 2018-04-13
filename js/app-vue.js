/*

# Table of contents:

## Browser APIs used:

* Speech synthesis => line 358 (inside speak method)
* Audio => line 186 (inside deleteEmail method )

## Ajax calls: 

* fetch1 => line 58
* fetch2 => line 83

*/

// Register Google Map Vue component

// Vue.component("google-map", {
//   template: '<div class="google-map" :id="mapName"></div>',
//   data: function () {
//     return {
//       mapName: "GoogleMap"
//     };
//   }
// });

// Vue
const app = new Vue({
  el: "#app",
  beforeMount: function () {
    this.initialize();
  },
  mounted: function () {
    this.gen = this.addEmails();
    ////this.initMap(); //it will only work with HTTPS
    // this.speak();
  },
  data: {
    emails: [],
    newEmails: [],
    selectedEmail: 0,
    currentFolder: "inbox",
    filteredEmails: [],
    gen: "",
    speaking: false
  },
  methods: {
    initialize: function () {
      // Check if 'emails' exists on localStorage
      if (localStorage.getItem("emails")) {
        // If true, use the emails from localStorage
        this.emails = JSON.parse(localStorage.getItem("emails"));

        // Filter them accordingly to the current folder
        this.filterFolder();
      } else {
        // Fetch emails from json file
        function fetch1() {
          fetch(
              "https://gist.githubusercontent.com/leticiabecker/dafa2f2b7f6a2d87c3835d31f97ea9e2/raw/de9e6887e5f3fb4c3ce0e7e7c5067e21102027ed/emails.json"
            )
            .then(res => {
              // If status is ok
              if (res.ok) {
                console.log(res);
                return res.json();
              }
              throw new Error("Network response was not ok.");
            })
            .then(data => {
              app.emails = data;
              console.log(data);
              app.filterFolder();
            })
            .catch(function (error) {
              console.log(
                "There has been a problem with your fetch operation: ",
                error.message
              );
            });
        }

        async function fetch2() {
          const response = await fetch(
            "https://gist.githubusercontent.com/leticiabecker/dafa2f2b7f6a2d87c3835d31f97ea9e2/raw/89fb1e5463b54da3d30d77e854301a1a0be57492/emails.json"
          );

          // const response = await fetch("./js/data/emails.json");
          const data = await response.json();
          app.emails = data;
          console.log(data);
          app.filterFolder();
        }

        fetch2();

        async function receiveNewEmails() {
          const response = await fetch("https://gist.githubusercontent.com/leticiabecker/860c01808f45779dd8943ed2897ea1b2/raw/10ec4a7abcef02d5a49e8d6f4248380962738a69/newEmails.json");
          const data = await response.json();
          app.newEmails = data;
          console.log(data);
          app.filterFolder();
        }
        receiveNewEmails();
      }
    },

    // Filter accordingly to the current folder
    filterFolder: function () {
      // If Inbox
      if (this.currentFolder === "inbox") {
        // Check if there are still emails in the inbox and filter them
        if (this.emails.filter(email => email.deleted === false).length > 0) {
          // Update filteredEmails array
          this.filteredEmails = this.emails.filter(
            email => email.deleted === false
          );
        } else {
          // If there is no more emails in the inbox
          console.warn("no emails on inbox");

          // Update filteredEmails array
          this.filteredEmails = this.emails.filter(
            email => email.deleted === false
          );
        }

        // If Trash
      } else if (this.currentFolder === "trash") {
        // Check if there are still emails in the trash and filter them
        if (this.emails.filter(email => email.deleted === true).length > 0) {
          // Update filteredEmails array
          this.filteredEmails = this.emails.filter(
            email => email.deleted === true
          );
          // selectEmail();
        } else {
          // If there is no more emails in the trash
          console.warn("no emails on trash");

          // Update filteredEmails array
          this.filteredEmails = this.emails.filter(
            email => email.deleted === true
          );
        }
      }
    },

    selectEmail: function (email, index) {
      // When an email on the list is clicked, check if it is not selected
      if (!this.selected()) {
        // Update selectedEmail using its index - it will update the main automatically
        this.selectedEmail = index;
        //app.initMap();
        // app.speak();
      }
    },

    selected: function (index) {
      return index === this.selectedEmail;
    },

    addEmails: function* () {
      let indexEmails = 0;

      while (indexEmails < this.newEmails.length)
        yield this.newEmails[indexEmails++];
    },

    btn_addEmails: function () {
      let tempObj = this.gen.next() || {};

      // so as to prevent pushing an empty object
      tempObj.done ?
        console.warn("no more emails") :
        this.emails.unshift(tempObj.value);

      this.currentFolder === "inbox";
      this.filterFolder();
    },

    deleteEmail: function (id) {
      // Get the email's index on the main Array using its id
      let emailIndex = this.emails.findIndex(e => e.id === id);

      const sound = new Audio("audio/delete.mp3");
      sound.play();

      // Check if the email already has the deleted property = true.
      if (!this.emails[emailIndex].deleted) {
        // If not, set deleted = true
        this.$set(this.emails[emailIndex], "deleted", true);

        // Update local storage
        this.setLocalStorage();

        // Update view of inbox
        this.displayInbox();
        this.selectedEmail = 0;
      } else {
        // If the current game has the key/value deleted:true, set it to false (Recover from Trash)
        this.emails[emailIndex].deleted = false;

        // Update local storage
        this.setLocalStorage();

        // Update view
        this.displayTrash();
        this.selectedEmail = 0;
      }
    },

    displayTrash: function () {
      this.currentFolder = "trash";
      this.selectedEmail = 0;
      this.filterFolder();
      //this.initMap();
    },

    displayInbox: function () {
      this.currentFolder = "inbox";
      this.selectedEmail = 0;
      this.filterFolder();
      //this.initMap();
    },

    setLocalStorage: function () {
      // update state of emails array on localStorage
      localStorage.setItem("emails", JSON.stringify(this.emails));
    },

    isEmpty: function () {
      return this.filteredEmails.length === 0;
    },

    // initMap: function () {
    //   //*** Google Maps API ****//
    //   let infoWindow = new google.maps.InfoWindow();

    //   // Instantiate a directions service.
    //   let directionsService = new google.maps.DirectionsService();

    //   // Create a map and center it in Barrie.
    //   let map = new google.maps.Map(document.querySelector(".google-map"), {
    //     zoom: 13,
    //     center: {
    //       lat: 44.388792,
    //       lng: -79.687933
    //     }
    //   });

    //   // Create a renderer for directions and bind it to the map.
    //   let directionsDisplay = new google.maps.DirectionsRenderer({
    //     map: map
    //   });

    //   // Get the user's geolocation
    //   const userGeolocation = function () {
    //     // Try HTML5 geolocation.
    //     if (navigator.geolocation) {
    //       navigator.geolocation.getCurrentPosition(
    //         function (position) {
    //           let pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //           };

    //           // Set origin & destination
    //           let origin = new google.maps.LatLng(pos.lat, pos.lng);
    //           let destination = document
    //             .querySelector(".postalCode")
    //             .textContent.toString();

    //           // Display the route between the initial start and end selections.
    //           calculateAndDisplayRoute(
    //             origin,
    //             destination,
    //             directionsDisplay,
    //             directionsService,
    //             map
    //           );
    //         },
    //         function () {
    //           // Try to find user's location based on IP
    //           async function findLocationByIp() {
    //             const response = await fetch("http://ip-api.com/json");
    //             const data = await response.json();
    //             console.log(data);

    //             // Set origin & destination
    //             let origin = data.zip;
    //             console.log(origin);
    //             let destination = document
    //               .querySelector(".postalCode")
    //               .textContent.toString();

    //             // Display the route between the initial start and end selections.
    //             calculateAndDisplayRoute(
    //               origin,
    //               destination,
    //               directionsDisplay,
    //               directionsService,
    //               map
    //             );
    //           }
    //           findLocationByIp();

    //           // handleLocationError(true, infoWindow, map.getCenter());
    //         }
    //       );
    //     } else {
    //       // Browser doesn't support Geolocation
    //       handleLocationError(false, infoWindow, map.getCenter());
    //     }
    //   };

    //   userGeolocation();

    //   function calculateAndDisplayRoute(
    //     origin,
    //     destination,
    //     directionsDisplay,
    //     directionsService,
    //     map
    //   ) {
    //     // Retrieve the start and end locations and create a DirectionsRequest using
    //     // DRIVING directions.
    //     directionsService.route({
    //         origin: origin,
    //         destination: destination,
    //         travelMode: "DRIVING"
    //       },
    //       function (response, status) {
    //         // Route the directions and pass the response to a function to create
    //         // markers for each step.
    //         if (status === "OK") {
    //           document.getElementById("warnings-panel").innerHTML =
    //             "<b>" + response.routes[0].warnings + "</b>";
    //           directionsDisplay.setDirections(response);
    //         } else {
    //           window.alert("Directions request failed due to " + status);
    //         }
    //       }
    //     );
    //   }

    //   function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent(
    //       browserHasGeolocation ?
    //       "Error: The Geolocation service failed." :
    //       "Error: Your browser doesn't support geolocation."
    //     );
    //     infoWindow.open(map);
    //   }
    // },

    speak: function (button) {
      //**** Speech Syntesis API ****//
      const content = new SpeechSynthesisUtterance();
      content.text = this.filteredEmails[this.selectedEmail].body;
      speechSynthesis.cancel();

      // // If 'Speak' button, start speaking
      if (button === "speak") {
        app.isSpeaking();
        speechSynthesis.speak(content);
      } else if (button === "stop") {
        // If 'Stop''button, stop speaking
        app.speaking = false;
      }
    },

    isSpeaking: function () {
      this.speaking = !this.speaking;
    }
  }
});
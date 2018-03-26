// Initialize Firebase
// Initialize Firebase
$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyBBTrVSR-zIK2j4x6wgLkcLbpkINcL1Eek",
        authDomain: "chuggachewchew-ad9d7.firebaseapp.com",
        databaseURL: "https://chuggachewchew-ad9d7.firebaseio.com",
        projectId: "chuggachewchew-ad9d7",
        storageBucket: "chuggachewchew-ad9d7.appspot.com",
        messagingSenderId: "844672426795"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    //capture user input from text boxes
    $("#submit").on("click", function (event) {
        //prevent default submit/click behaviour
        event.preventDefault();
        var train = $("#train").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#first-train-time").val().trim();
        var frequency = $("#frequency").val().trim();

        // console.log("Submit button was clicked");
        // console.log(train, destination, firstTrainTime, frequency);

        //Push to firebase
        database.ref().push({
            trainName: train,
            destination: destination,
            firstTrainTime: firstTrainTime,
            freq: frequency
        }
        );
        //reset fields to prepare for next submission
        $('#trainForm').trigger("reset");

    });//end submit click event function

    // populate table with updated train infoes
    database.ref().on("child_added", function (childSnapshot) {
        var ssTrain = childSnapshot.val().trainName;
        var ssDestination = childSnapshot.val().destination;
        var ssFirstTrainTime = childSnapshot.val().firstTrainTime;
        var ssFreq = childSnapshot.val().freq;
        console.log(ssTrain, ssDestination, ssFirstTrainTime, ssFreq);

        // Set variables from user inputs
        var tFrequency = ssFreq;
        var firstTime = ssFirstTrainTime;
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // Get Current system Time
        var currentTime = moment();
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        $('#schedule-table > tbody')
            .append(`<tr>
                    <td>${ssTrain}</td>
                    <td>${ssDestination}</td>
                    <td>${ssFirstTrainTime}</td>
                    <td>${nextTrain}</td>
                    <td>${tMinutesTillTrain}</td>
            </tr>`)
    })


}) //end document ready function

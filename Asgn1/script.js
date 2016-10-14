var KEY = "#################################";

function representativeInfoByAddress() {
    $.ajax({
        url: "https://www.googleapis.com/civicinfo/v2/representatives",
        data: {
            key: KEY,
            address: $("#addressInput")[0].value
        },

        error: function() {
            alert("Please try another address");
        },

        success: function(response) {

            // if the table already exists, delete it and create again
            if ($("#officialsTbl").length) {
                $("#officials").empty();
            }
            // create "officialsTbl" and append it to "Officials" div
            $("<table id='officialsTbl'></table>").appendTo($("#officials"));
            $("#officialsTbl").attr("class", "cell-border hover");
            $("#officialsTbl").attr("cellspacing", "0");
            $("#officialsTbl").attr("width", "100%");

            $("<thead></thead>").appendTo($("#officialsTbl"));
            $("#officialsTbl thead").append("<tr></tr>");
            $("#officialsTbl thead tr").append("<th>Name</th>");
            $("#officialsTbl thead tr").append("<th>Photo</th>");
            $("#officialsTbl thead tr").append("<th>Party</th>");
            $("#officialsTbl thead tr").append("<th>Address</th>");
            $("#officialsTbl thead tr").append("<th>Phone</th>");
            $("#officialsTbl thead tr").append("<th>Channels</th>");

            $('#officialsTbl').DataTable({
                "lengthMenu": [
                    [10],
                    [10]
                ]
            });

            $('#officials').append("<br/><br/>")


            // handle Official table
            if (response['officials']) {
                var officials = response['officials'];
                for (official of officials) {

                    // handle phone
                    var phonesStr = "";
                    if (official['phones']) {
                        for (phone of official['phones']) {
                            phonesStr += phone + "<br/>"
                        }
                    }

                    // handle address
                    var addressesStr = "";
                    if (official['address']) {
                        for (address of official['address']) {
                            var i = 1;
                            while (address['line' + i]) {
                                addressesStr += address['line' + (i++)] + " ";
                            }
                            if(addressesStr) addressesStr += "<br/>";
                            addressesStr += address['city'] + ", " + address['state'] + " " + address['zip'];
                        }
                    }

                    // handle channels
                    var channelsStr = "";
                    if (official['channels']) {
                        for (channel of official['channels']) {
                            channelsStr += "<a href=http://www." + channel['type'] + ".com/" + channel['id'] + ">" + channel['type'] + "</a><br/>"
                        }
                    }

                    $("#officialsTbl").DataTable().row.add([
                        official['name']? official['name']: "<p id='error'>NO NAME INFO</p>",
                        official['photoUrl'] ? "<img src=" + official['photoUrl'] + "></img>" : "<p id='error'>NO PHOTO</p>",
                        official['party']? official['party']: "<p id='error'>NO PARTY INFO</p>",
                        addressesStr? addressesStr: "<p id='error'>NO ADDRESS INFO</p>",
                        phonesStr? phonesStr: "<p id='error'>NO PHONE INFO</p>",
                        channelsStr? channelsStr: "<p id='error'>NO CHANNELS INFO</p>"
                    ]).draw(false);
                }
            }

            // handle offices when user requested
            if ($("#includeOffices").val() === "true") {

                // if the offices table already exists, delete it and create again
                if ($("#officesTbl").length) {
                    $("#office").empty();
                }

                // create "officesTbl" and append it to "Officials" div
                $("<table id='officesTbl'></table>").appendTo($("#office"));
                $("#officesTbl").attr("class", "cell-border hover");
                $("#officesTbl").attr("cellspacing", "0");
                $("#officesTbl").attr("width", "50%");

                $("<thead></thead>").appendTo($("#officesTbl"));
                $("#officesTbl thead").append("<tr></tr>");
                $("#officesTbl thead tr").append("<th>Name</th>")
                $("#officesTbl thead tr").append("<th>Level</th>")
                $("#officesTbl thead tr").append("<th>Role</th>")

                $("#officesTbl").DataTable({
                    "lengthMenu": [
                        [10],
                        [10]
                    ],
                });


                var offices = response['offices'];
                if (offices) {
                    for (office of offices) {

                        var levelsStr = "";
                        if (office['levels']) {
                            var i = 0;
                            while (office['levels'][i]) {
                                if ($.inArray(office['levels'][i], $("#Levels-select").val()) != -1 || $("#Levels-select").val() == null) {
                                    levelsStr += "<p>" + office['levels'][i++] + "</p>";
                                }
                                ++i;
                            }
                        }

                        if (levelsStr === "") continue;

                        var rolesStr = "";
                        if (office['roles']) {
                            var i = 0;
                            while (office['roles'][i]) {
                                if ($.inArray(office['roles'][i], $("#Roles-select").val()) != -1 || $("#Roles-select").val() == null) {
                                    rolesStr += "<p>" + office['roles'][i++] + "</p>";
                                }
                                ++i;
                            }
                        }

                        if (rolesStr === "") continue;


                        $("#officesTbl").DataTable().row.add([
                            office['name']? office['name']:"", 
                            levelsStr, rolesStr
                        ]).draw(false);
                    }
                }
            }
        }
    })
}


$(document).ready(function() {
    // activate the chosen plugin
    $(".chosen-select").chosen()


    $("#searchBtn").click(function() {
        var levels = $("#Levels-select").chosen().val();
        var roles = $("#Roles-select").chosen().val();
        var includeOffices = $("#includeOffices").val();




        if($("#addressInput")[0].value.length == 0) alert("Please enter an address first!");
        else representativeInfoByAddress();

    })
});

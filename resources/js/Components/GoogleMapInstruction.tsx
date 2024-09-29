const GoogleMapInstruction = () => {
    return (
        <div className="">
            <div>
                1. Go to Google Maps Open your web browser and visit Google
                Maps.
            </div>
            <div>
                2. Search for a Location In the search bar, type the address,
                location, or business name you want to embed on your website.
                Hit Enter to search.
            </div>
            <div className="flex flex-col">
                <span>
                    3. Click on the Location After searching, click on the
                    specific location in the map view that you want to share.
                </span>{" "}
                <span>
                    This step highlights the location and shows more details.
                </span>
            </div>
            <div className="flex flex-col">
                <span className=" ">
                    4. Click the "Share" Button Once the location is selected,
                    click the "Share" button. You can find this button:
                </span>
                <span>
                    On the left sidebar, under the location details. On the map
                    view, near the location’s name (a small icon with a share
                    arrow).
                </span>
            </div>
            <div className="flex flex-col">
                <span>
                    5. Choose the "Embed a Map" Tab A popup window will appear.
                    At the top, you’ll see two options: Send a Link and Embed a
                    Map.
                </span>
                <span>
                    Click on the "Embed a Map" tab to generate the iFrame link.
                </span>
            </div>
            <div className="flex flex-col">
                <span>
                    6. Copy the iFrame Code Below the map, you’ll see a box with
                    the iFrame code. The code looks like this: html Copy code.
                </span>
                <span>
                    Click on "Copy HTML" to copy the entire iFrame code.
                </span>
            </div>
        </div>
    );
};

export default GoogleMapInstruction;

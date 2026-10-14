import "./App.css";
import { Component } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./components/Navigation/Navigation";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  // Convert HuggingFace API data to mimic Clarifai API data
  createClarifaiBoundingBox = (pixelBox, imageWidth, imageHeight) => {
    return {
      left_col: pixelBox.xmin / imageWidth,
      top_row: pixelBox.ymin / imageHeight,
      right_col: pixelBox.xmax / imageWidth,
      bottom_row: pixelBox.ymax / imageHeight,
    };
  };

  calculateFaceLocation = (data) => {
    // Get ALL items labeled "person" instead of just the first one
    const personItems = data.filter((item) => item.label === "person");

    // With new HuggingFace API we need display width as well as original image width
    const image = document.getElementById("inputimage");
    const originalWidth = Number(image.naturalWidth);
    const originalHeight = Number(image.naturalHeight);
    const width = Number(image.width);
    const height = Number(image.height);

    // Loop through every person found and calculate their box
    const boundingBoxes = personItems.map((person) => {
      const clarifaiFace = this.createClarifaiBoundingBox(
        person.box,
        originalWidth,
        originalHeight,
      );
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });

    return boundingBoxes;
  };

  displayFaceBoxes = (boxes) => {
    this.setState({ boxes: boxes });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    // 1. Send the image URL to backend
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // 2. If the model is sleeping, Hugging Face returns an error object, not an array.
        if (!Array.isArray(result)) {
          console.log("Hugging Face API Error or Loading:", result);
          return; // Stop here so the app doesn't crash!
        }
        // 3. If we safely got the array, update the entries count
        fetch("http://localhost:3000/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.state.user.id,
          }),
        })
          .then((res) => res.json())
          .then((count) => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch(console.log);

        // 4. Calculate and draw the boxes
        this.displayFaceBoxes(this.calculateFaceLocation(result));
      })
      .catch((err) => console.log("Error fetching from backend:", err));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;

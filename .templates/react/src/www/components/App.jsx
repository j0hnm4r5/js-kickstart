import React, { Component } from "react";
import styled from "react-emotion";

const Container = styled.div`
    background-color: #bada55;
    color: white;
    font-size: 2em;
    padding: 2em;
`;

export default class App extends Component {
    render() {
        return (
            <Container>
                Hello, World! This is a React Component.
            </Container>
        );
    }
}

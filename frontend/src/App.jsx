import React, { useState } from "react";
import { grpcClient } from "./lib/grpcClient.js";
import * as PingPb from "./grpc/ping_pb.js";

export default function App() {
    const [input, setInput] = useState("");
    const [reply, setReply] = useState("");

    const send = () => {
        const req = new PingPb.PingRequest();
        req.setMessage(input);
        grpcClient.ping(req, {}, (err, res) => {
            if (err) return setReply("Error: " + err.message);
            setReply(res?.getMessage?.() ?? "");
        });
    };

    return (
        <main style={{ maxWidth: 520, margin: "4rem auto", fontFamily: "system-ui" }}>
            <h1>gRPC Ping (PHP 7.3)</h1>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                style={{ width: "100%", padding: 12, marginBottom: 12 }}
            />
            <button onClick={send} style={{ padding: "8px 16px" }}>Send to backend</button>
            <p style={{ marginTop: 16 }}>Reply: <strong>{reply}</strong></p>
        </main>
    );
}
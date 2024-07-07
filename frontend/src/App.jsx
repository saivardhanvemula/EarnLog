import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import deleteIcon from "./assets/delete.svg";
function App() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);

    const date = new Date();
    const todayDate = date.toISOString().split("T")[0];
    const [formData, setFormData] = useState({
        date: todayDate,
        earn: "",
        bonus: "yes",
    });
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/data");
            let data = response.data;

            // console.log(logs);
            let updatedTotal = 0;
            data.map((log) => {
                if (log.bonus === "yes") {
                    updatedTotal += 150 + Number(log.earn);
                } else {
                    updatedTotal += Number(log.earn);
                }
            });
            setLogs(data);
            setTotal(updatedTotal);
        } catch (e) {
            console.log(e);
            setLogs([]);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log(formData); 
        let dateExists = false;
        for (let i = 0; i < logs.length; i++) {
            if (formData.date === logs[i].date) {
                console.log("Date already exists");
                alert("Date already exists");
                dateExists = true;
                break;
            }
        }
        if (!dateExists) {
            try {
                const response = await axios.post(
                    "http://localhost:3000/new",
                    formData
                );
                console.log("Form submitted successfully:", response.data);
                setLogs([...logs, formData]);
                if (formData.bonus === "yes") {
                    setTotal(total + 150 + Number(formData.earn));
                } else {
                    setTotal(total + Number(formData.earn));
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    return (
        <>
            <div className="box">
                <h1>
                    EarnLogs <span>{total}</span>
                </h1>
                <div className="new">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="date">Date:</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                        />
                        <label htmlFor="earn">Earnings:</label>
                        <input
                            type="number"
                            id="earn"
                            name="earn"
                            required
                            value={formData.earn}
                            onChange={handleChange}
                        />
                        <label htmlFor="bonus">Bonus:</label>
                        <select
                            id="bonus"
                            name="bonus"
                            required
                            value={formData.bonus}
                            onChange={handleChange}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                        <input type="submit" value="Submit" />
                    </form>
                </div>

                <div className="logs">
                    {logs.length === 0 ? (
                        <p>Loading...</p>
                    ) : (
                        logs.map((log, index) => (
                            <div className="log" key={index}>
                                <div className="details">
                                    Date: {log.date}, Earnings: {log.earn},
                                    Bonus: {log.bonus}
                                </div>
                                <button onClick={() => console.log(log)}>
                                    <img src={deleteIcon} alt="" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default App;

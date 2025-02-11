import snackBar from "../components/snackBar.js";
import { populateSubjects } from "../redux/subjectSlice.js";

async function fetchSubjects(dispatch) {
    try {
        const res = await fetch('/server/data/all_available/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'operation': 'fetch all questions' })

        });

        const data = await res.json();
        if (!res.ok) {
            snackBar({ error: true, message: data.message });
            console.log(res);
        }
        //console.log(data);
        dispatch(populateSubjects(data));
        if (!data?.length) {
            snackBar({ customPurple: true, message: "No Questions Found", timeout: 4000 })
        }
    }
    catch (err) {
        snackBar({ error: true, message: "Request Error" })
        console.log(err);
    }
}

export default fetchSubjects;

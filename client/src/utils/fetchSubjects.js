async function fetchSubjects() {
    try {
        const res = await fetch('/data/all_available');
        
        if(res) {
            return false; 
        }
        const data = res.json();
        return data;
    }
    catch(err) {
        console.log(err);
        return err;
    }
}

export default fetchSubjects;
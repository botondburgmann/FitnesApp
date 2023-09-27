import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";


export const signUp =async (name, setLoading, auth, email, password) => {
    setLoading(true);
    try {
        if (name === '')
            throw new Error('Name must be set'); 
        const response = await createUserWithEmailAndPassword(auth, email,password);
        await addDoc(collection(FIRESTORE_DB, 'users'), {userID: response.user.uid, name: name, gender: "", age: 0, weight: 0, height: 0, activityLevel: "", set: false});
        
        alert('Registered successfully!');
    }   catch (error:any) {
        alert('Registration failed: ' + error.message);
    }   finally{
        setLoading(false);
    }
}

export const setUpProfile =async (field, value, userID) => {
    try {

        // Check for empty value
        if (value === '')
            throw new Error(`${field} must be set`);

        // If the field is age then calculate it from date of birth
        if (field === 'age'){
            const today = new Date()      
            const age =  today.getFullYear()-value.getFullYear();      
            
            // Users can't be 0 years old
            if (age === 0)
                throw new Error("Damn bro, you just got born and you wanna train?");
        }

        if (field === 'activityLevel')
            if (value === null)
                throw new Error("Please select one of the following levels");
        const usersCollection = collection(FIRESTORE_DB, 'users');
        const q = query(usersCollection, where("userID", '==',userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
            const userDocRef = doc(FIRESTORE_DB, 'users', docSnapshot.id);

            // After the last step set the set field to true
            if (field === 'activityLevel') {
                const newData = { [field]: value,set: true }; 
                await updateDoc(userDocRef, newData);
            } else {
                const newData = { [field]: value}; 
                await updateDoc(userDocRef, newData);
            }
        });  
    }   catch (error:any) {
        alert('Adding data has failed: ' + error.message);
    }
}


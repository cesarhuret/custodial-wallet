
const getUserProfile = async () => {
    const result = await fetch('https://walletapi.kesarx.repl.co/api/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: sessionStorage.getItem('token')
        })
    }).then((res) => res.json());

    return result;
}

export default getUserProfile;
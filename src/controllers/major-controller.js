const fetchMajors = async (req, res) => {
    console.log(req.User)
    res.send('hello world')
}

const createMajor = async (req, res) => {
    console.log(req.User)
    res.send('hello world')
}

export { fetchMajors, createMajor }

const axios = require('axios');
const { User } = require('../../models');

module.exports = async (req, res) => {
    if (req.body.username !== User.username && req.body.password !== User.password){
        res.status(400).send({ error: "Your username or password doesn't exist" })
    } else {
        try {

            const mutation = `
                mutation ($email: String!, $password: String!){
                    register(
                        email: $email
                        password: $password
                    )
                }
            `

            const { data } = await axios.get(process.env.GRAPHQL_ENDPOINT,
                    {
                        query: mutation,
                        variables: {
                            email: req.body.email,
                            password: req.body.password
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                )
            const jwtoken = data.data.login;
            res.cookie('jwtoken', jwtoken, { httpOnly: true });
            res.redirect('/');

        } catch(err){
            console.log(err)
            res.redirect('/auth/login')
        }
    }
}

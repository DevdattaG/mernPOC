const secrets = {
    dbUri: 'mongodb://devdatta:aswd@ds133296.mlab.com:33296/dg'
}

export const getSecret = key => secrets[key];
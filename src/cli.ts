
import docopt from 'docopt'
import peruse from './peruse.js'

const docs = `
Name:
  peruse - scroll and cycle through pages

Usage:
  peruse --links <path>
`

const cli = async () => {
  const args = docopt.docopt(docs, {})
  await peruse(args)
}

cli()

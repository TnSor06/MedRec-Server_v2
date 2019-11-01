import Query from './Query'
import Mutation from './Mutation'

import {
    extractFragmentReplacements
} from 'prisma-binding'

const resolvers = {
    Query,
    Mutation
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export {
    resolvers,
    fragmentReplacements
}
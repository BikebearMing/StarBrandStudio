import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

const NotFound = () => NotFoundPage({ config, importMap })

export default NotFound

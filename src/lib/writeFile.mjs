import path from 'path'
import { log } from '@grundstein/commons'
import { fs } from '@magic/fs'

import sh from '../sh/index.mjs'

export const writeFile = async ({ dir, name, config, contents }) => {
  if (!name.endsWith('.mjs') && !name.endsWith('.json') && !name.endsWith('.sh')) {
    name = `${name}.sh`
  }
  const file = path.join(dir, name)

  const fileDir = path.dirname(file)

  try {
    await fs.mkdirp(fileDir)

    await fs.writeFile(file, contents)
  } catch (e) {
    log.error('E_WRITE_FILE', e)
    process.exit(1)
  }

  log.success('Wrote:', file)

  return file
}

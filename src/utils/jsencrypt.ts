import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDkoliRyO9NEkbuxirTrvANBjvn\n' +
  'dLC4npst+e2IubgEuzuNOwg77kj1SKZcsg0rgusFsg+QhNDfzgNp4XacXYvNbYF2\n' +
  'NwKcLaNOJJ2JP+Jh6Ll1p41WZWLXCiFBc9axTU1T8FmnoSdqB4bLRz628iDV/jsG\n' +
  'ggxeLuyKvpKpLqMVUQIDAQAB'

const privateKey =
  'MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBAOSiWJHI700SRu7G\n' +
  'KtOu8A0GO+d0sLiemy357Yi5uAS7O407CDvuSPVIplyyDSuC6wWyD5CE0N/OA2nh\n' +
  'dpxdi81tgXY3Apwto04knYk/4mHouXWnjVZlYtcKIUFz1rFNTVPwWaehJ2oHhstH\n' +
  'PrbyINX+OwaCDF4u7Iq+kqkuoxVRAgMBAAECgYEA1IxQhockYKQDKWs02UIijBkl\n' +
  'i5Eh0SAx51YXiyoMdumQ/UTJ7N0jGlSFxFsKf07gKpVUfufaPpWI+t/NoqQcmAVK\n' +
  'JEqRlftUpUMWnmgawY58sH7nVAbx4mz6DKIWYfalPU6WajV85zmKNrTeqJaC58Hy\n' +
  '16kXhh4TL3TSQQ0m1SECQQD9hriiU6WgVofEL9pIZ2oOUkJomh2TEAVvr2H8wz+x\n' +
  'ru5JcNZLrIgf2syu1fAV55rnxOAivewmZIIRLT4WgR+dAkEA5t1yfcaRDIlnl9nX\n' +
  'JDdng/QxOOrBbhGIlsDtdOUoBXUeXVqD/LuhJQmeT3FzngfGNvsn6RIYBg4kH6Ls\n' +
  '0t7QRQJBAPQQZOCIbDMN+keI1bfMLpI46ItwijYQP1uEWG2PvVqdj/INeY+COc2I\n' +
  'wnExrZ44x6yFoExxz8wqB/jnOBVMGxUCQQCLBaVRWka0fvXT+olUtMxwKJePh8Zt\n' +
  'ar+O0KTttKUSDEH5w20hvzc933nmqxINgu744utYrd2rn85fArSME0LlAkEA/R5I\n' +
  'Ae6A8NQDhSnstfKXB73mQAmAkF27siUBSlg57eBLPBJ854LtOCZ1/itdbRGPm3g0\n' +
  'IPKI7Em1/0lXtTisQQ=='

/**
 * 文本加密
 *
 * @param text 明文
 */
export const encrypt = (text: string): string => {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey)
  return encryptor.encrypt(text)
}

/**
 * 文本解密
 *
 * @param text 密文
 */
export const decrypt = (text: string): string => {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(text)
}

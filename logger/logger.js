'use strict';

import { 
    LoggerBuilder,
    VoiceLoggerBuilder
} from '../index.js';
import { STYLES } from './loggerstyles.js';

const 
    loggerBuilder = new LoggerBuilder(),
    voiceLoggerBuilder = new VoiceLoggerBuilder()
;

loggerBuilder
    .setStyleFn(STYLES.INFO)
    .setStyleFn(STYLES.SUCCESS)
    .setStyleFn(STYLES.ERR)
    .setStyleFn(STYLES.ERR)
    .setStyleFn(STYLES.WARN)
    .setStyleFn(STYLES.FAIL)
    .build()
;

voiceLoggerBuilder
    .setStyleFn(STYLES.INFO)
    .setStyleFn(STYLES.SUCCESS)
    .setStyleFn(STYLES.ERR)
    .setStyleFn(STYLES.ERR)
    .setStyleFn(STYLES.WARN)
    .setStyleFn(STYLES.FAIL)
    .build()
;

const 
    logger = loggerBuilder.create(),
    vLogger = voiceLoggerBuilder.create()
;

export {
    loggerBuilder,
    voiceLoggerBuilder,
    logger,
    vLogger
}
import { combineReducers } from 'redux'
import statera from './statera'
import pool from './pool'
import multiPool from './multiPool'

export default combineReducers({
	statera,
	pool,
	multiPool,
})

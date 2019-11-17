import * as d3 from 'd3';

class Parser {
	/**
	 * Instantiates a parser class for reading the segments and logs of a specific user
	 * 
	 * @param {*} datasetIndex The index of the dataset
	 * @param {*} userIndex The index of the user
	 */
    constructor(datasetIndex, userIndex) { 
		this.datasetIndex = datasetIndex;
		this.userIndex = userIndex;

		this.dataPath = "./data/ProvSegments/Dataset_" + datasetIndex;
		this.documentsPath = this.dataPath + "/Documents";
		this.segmentationPath = this.dataPath + "/Segmentation";
		this.userInteractions = this.dataPath + "/User Interactions";

		var datasetName = "";
		this.idName = "";
		switch(this.datasetIndex) {
			case 1: 
				datasetName = "Arms";
				this.idName = "Armsdealing";
				break;
			case 2:
				datasetName = "Terrorist";
				this.idName = "TerroristActivity";
				break;
			case 3:
				datasetName = "Disappearance";
				this.idName = "Disappearance";
				break;
			default:
				break;
		}
		
		this.documentsFile = this.documentsPath + "/" + `Documents_Dataset_${this.datasetIndex}.json`
		this.segmentationFile = this.segmentationPath + "/" + datasetName + `_P${this.userIndex}_20_4_6_Prov_Segments.csv`;
		this.userInteractionsFile = this.userInteractions + "/" + datasetName + `_P${this.userIndex}_InteractionsLogs.json`;

		this.promise = null;
	} 
	/**
	 * Returns all segments in the user's segment file
	 */
	getSegments() {
		this.promise = d3.csv(this.segmentationFile);
		return this;
	}
	
	/**
	 * Returns all events in the user's segment file within the specified time range.
	 * 
	 * @param {*} startTime The beginning of the time range (inclusive).
	 * @param {*} lastStartTime The end of the time range (inclusive)
	 */
	filterSegmentsTimeRange(startTime, endTime) {
		var start = Math.min(startTime, endTime);
		var end = Math.max(startTime, endTime);	
		function filter(data) {
			return data.filter(function(row) {
				return row.start >= start && row.end <= end;
			});
		};

		this.promise = this.promise === null ?
			d3.csv(this.segmentationFile).then(filter) :
			this.promise.then(filter);
		return this;
	}
	
	/**
	 * Returns all events in the user's segment file with start time within the specified time range
	 * 
	 * @param {*} startTime - The beginning of the time range (inclusive)
	 * @param {*} lastStartTime - The end of the time range (inclusive)
	 */
	filterSegmentsStartTimeRange(startTime, lastStartTime) {
		var start = Math.min(startTime, lastStartTime);
		var end = Math.max(startTime, lastStartTime);
		function filter(data) {
			return data.filter(function(row) {
				return row.start >= start && row.start <= end;
			});
		};

		this.promise = this.promise === null ?
			d3.csv(this.segmentationFile).then(filter) :
			this.promise.then(filter);
		return this;
	}
	
	/**
	 * Returns the segment with the specified ID
	 * 
	 * @param {*} id The id to match
	 */
	filterSegmentsWithID(id) {
		function filter(data) {
			return data.filter(function(row) {
				return row.ID == id;
			});
		};

		this.promise = this.promise === null ?
			d3.csv(this.segmentationFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all events not within the specified ID range
	 * 
	 * @param {*} startId The beginning of the ID range (inclusive)
	 * @param {*} stopId The stop of the ID range (inclusive)
	 */
	filterSegmentsIdRange(startId, stopId) {
		var start = Math.min(startId, stopId);
		var stop = Math.max(startId, stopId);
		function filter(data) {
			return data.filter(function(row) {
				return row.ID >= start && row.ID <= stop;
			});
		};

		this.promise = this.promise === null ?
			d3.csv(this.segmentationFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all interactions in the user interactions file
	 */
	getInteractions() {
		this.promise = d3.json(this.userInteractionsFile);
		return this;
	}

	/**
	 * Returns all interactions with the specified type
	 * 
	 * @param {*} type The interaction type to match
	 */
	filterInteractionsByType(type) {
		function filter(data) {
			return data.filter(function(data) {
				return data.InteractionType == type;
			});
		};

		this.promise = this.promise === null ?
			d3.json(this.userInteractionsFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all interactions with a start time within the specified range
	 * 
	 * @param {*} startTime The beginning of the time range (inclusive)
	 * @param {*} lastStartTime The end of the time range (inclusive)
	 */
	filterInteractionsStartTimeRange(startTime, lastStartTime) {
		var start = Math.min(startTime, lastStartTime);
		var end = Math.max(startTime, lastStartTime);
		function filter(data) {
			return data.filter(function(data) {
				return data.time >= start && data.time <= end;
			});
		};

		this.promise = this.promise === null ?
			d3.json(this.userInteractionsFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all interactions with start or end time (time + duration) 
	 * that overlaps with the specified time range.
	 * 
	 * @param {*} startTime The beginning of the time range (inclusive)
	 * @param {*} endTime The end of the time range (inclusive)
	 */
	filterInteractionsTimeOverlap(startTime, endTime) {
		var start = Math.min(startTime, endTime);
		var end = Math.max(startTime, endTime);
		function filter(data) {
			return data.filter(function(data) {
				var eventStartTime = data.time;
				var eventEndTime = data.time + data.duration;
				return eventEndTime >= start && eventStartTime <= end;
			});
		};

		this.promise = this.promise === null ?
			d3.json(this.userInteractionsFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all interactions with the specified ID
	 * 
	 * @param {*} id The id to match
	 */
	filterInteractionsWithID(id) {
		var idString = id;
		if (isFinite(id)) {
			idString = (this.idName + " " + id).toUpperCase();
		}
		else {
			idString = (id).toUpperCase();
		}
		function filter(data) {
			return data.filter(function(data) {
				return String(data.ID).toUpperCase() == idString;
			});
		};

		this.promise = this.promise === null ?
			d3.json(this.userInteractionsFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	/**
	 * Returns all documents in the doucments file
	 */
	getDocuments() {
		this.promise = d3.json(this.documentsFile);
		return this;
	}

	/**
	 * Returns the document with the specifeid document
	 * 
	 * @param {*} id The document id to match
	 */
	filterDocumentsWithID(id) {
		var idString = id;
		if (isFinite(id)) {
			idString = (this.idName + id).toUpperCase();
		}
		function filter(data) {
			return data.filter(function(data) {
				return String(data.id).toUpperCase() === idString;
			});
		};

		this.promise = this.promise === null ?
			d3.json(this.documentsFile).then(filter) :
			this.promise.then(filter);
		return this;
	}

	data() {
		var promise = this.promise;
		this.promise = null;
		return promise;
	}
}

export default Parser;

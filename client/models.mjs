import dayjs from "dayjs";

function Station(id, name){
    this.id=id;
    this.name=name;
}

function Line(id, name){
    this.id=id;
    this.name=name;
}

function Connection(id, lineId, lineName, stationAId, stationAName, stationBId, stationBName){
    this.id=id;
    this.lineId=lineId;
    this.lineName=lineName;
    this.stationAId=stationAId;
    this.stationAName=stationAName;
    this.stationBId=stationBId;
    this.stationBName=stationBName;
}

function Event(id, description, effect){
    this.id=id;
    this.description=description;
    this.effect=effect;
}

function Game(id, userId, startStationId, startStationName, endStationId, endStationName, finalScore=null, playedAt){
    this.id=id;
    this.userId=userId;
    this.startStationId=startStationId;
    this.startStationName=startStationName;
    this.endStationId=endStationId;
    this.endStationName=endStationName;
    this.finalScore=finalScore;
    this.playedAt=dayjs(playedAt);
}

function User(id, username, name, surname){
    this.id=id;
    this.username=username;
    this.name=name;
    this.surname=surname;
}

export { Station, Line, Connection, Event, Game, User };
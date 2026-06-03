import dayjs from "dayjs";

function Station(id, name){
    this.id=id;
    this.name=name;
}

function Connection(id, stationAId, stationAName, stationBId, stationBName){
    this.id=id;
    this.stationAId=stationAId;
    this.stationAName=stationAName;
    this.stationBId=stationBId;
    this.stationBName=stationBName;
}

function User(id, username, name, surname){
    this.id=id;
    this.username=username;
    this.name=name;
    this.surname=surname;
}

export { Station, Connection, User };
'use strict';

var phoneBook = []; 

module.exports = {
	add: add,
	find: find,
	remove: remove,
	importFromCsv: importFromCsv,
	showTable: showTable,
}

function validityPhone(str){
	var i;
	var amountNumber = 0;
	var flag = 0; // значение флага: 0-нет "("; 1-есть "("; 2-есть "("и")"
	
	if(str.charAt(0) === '+'){
		i=1;
	} else {
		i=0;
	}
	if(str.charAt(i) === '-'){
		return fals;
	}
	
	for(i;i<str.length;i++){
		if(Number(str.charAt(i)) || str.charAt(i) === '-' || str.charAt(i) === ' '){
			if(Number(str.charAt(i))){
				amountNumber++;
			}
			if(str.charAt(i) === '-' && (str.charAt(i-1) === ')' || str.charAt(i-1) === '-')){
				return false;
			}
		} else{
			if(str.charAt(i) === '(' && amountNumber<3 && str.charAt(i-1) !== '+'){ // проверка правильности постановки скобок
				if(flag === 0){
					flag++;
				} else{
					return false;
				}
			} else{
				if(str.charAt(i) === ')' && flag === 1 && str.charAt(i-4) === '('){
					flag++;
				} else{
					return false;
				}
			}
		}
	}
	
	return flag !== 1 && amountNumber>=10;
}

function formattingPhone(phone){
	const digitRegExp = /\d+/g;
	var cleanPhone =  phone.match(digitRegExp).join('');
	var formPhone = '';
	
	if(cleanPhone.length === 10){
		formPhone = '+7 ';
	}else{
		if(cleanPhone.length === 11){
			if(cleanPhone[0] === '8'){
				formPhone = '+7 ';
			} else{
				formPhone = '+'+cleanPhone[0]+' ';
			}
			cleanPhone = cleanPhone.substring(1);
		}else{
			if(cleanPhone.length === 12){
				formPhone = '+'+cleanPhone.substring(0,2)+' ';
				cleanPhone = cleanPhone.substring(2);
			}
		}
	}
	
	formPhone +=
		'('+cleanPhone.substring(0,3)+') '+
		cleanPhone.substring(3,6)+'-'+
		cleanPhone.substring(6,8)+'-'+
		cleanPhone.substring(8);
		
	return formPhone;
}

function buildLine(n,symble){
	var result = '';
	for(var i=0;i<=n;i++){
		result += symble;
	}
	return result;
}

function add(name, phone, email){
	var user = {
		name: name,
		phone: phone,
		email: email
	};
	const regexMail = /^[\w\.\d-_]+@[\w\.\d-_а-я]+\.[\wа-я]{2,4}$/i;
	if (!(validityPhone(phone) && regexMail.test(email))) {
		return false;
	};
	phoneBook.push(user);
	return true;
};

function find(query){
	var goodList = [];
	for(var i=0;i<phoneBook.length;i++){
		if(phoneBook[i].name.indexOf(query)+1 || 
		phoneBook[i].phone.indexOf(query)+1 || 
		phoneBook[i].email.indexOf(query)+1){
			goodList.push(phoneBook[i]);
		}
	}
	return goodList;
};

function remove(query){
	var haveSubstring = function (str) {
		return str.indexOf(query)+1;
	};
	for(var i=0;i<phoneBook.length;i++){
		if(haveSubstring(phoneBook[i].name) || 
		   haveSubstring(phoneBook[i].phone) || 
		   haveSubstring(phoneBook[i].email)){
			console.log('Deleted: '+phoneBook[i].name);
			phoneBook.splice(i,1);
			i--;
		}
	}
};

function importFromCsv(filename){	
    var data = require('fs').readFileSync(filename, 'utf-8');
	var amountAdds = 0;
    data = data.split(/[;\r\n]+/g);
    for (var i = 0; i < data.length; i += 3) {
        if(this.add(data[i], data[i + 1], data[i + 2])){
			amountAdds++;
		}
    };
	console.log('Добавлено записей:'+amountAdds+'\n');
};

function showTable(filename){
	const widthName = 20;
	const widthPhone = 20;
	const widthEmail = 25	;
	
	console.log('+'+buildLine(widthName,'=')+'+'+buildLine(widthPhone,'=')+'+'+buildLine(widthEmail,'=')+'+');
	console.log('¦ Имя'+buildLine(widthName-4,' ')+'¦ Телефон'+buildLine(widthPhone-8,' ')+'¦ email'+buildLine(widthEmail-6,' ')+'¦');
	console.log('+'+buildLine(widthName,'=')+'+'+buildLine(widthPhone,'=')+'+'+buildLine(widthEmail,'=')+'+');

	var name, phone, email;
	for(var i=0;i<phoneBook.length;i++){
		name = phoneBook[i].name;
		phone = formattingPhone(phoneBook[i].phone);
		email = phoneBook[i].email;
		
		while(!(name === '') || !(phone === '') || !(email === '')){
			console.log('¦ '+name.substring(0,widthName-1)+buildLine(widthName-1-name.substring(0,widthName-1).length,' ')+
						'¦ '+phone.substring(0,widthPhone-1)+buildLine(widthPhone-1-phone.substring(0,widthPhone-1).length,' ')+
						'¦ '+email.substring(0,widthEmail-1)+buildLine(widthEmail-1-email.substring(0,widthEmail-1).length,' ')+'¦');
			name = name.substring(widthName-1);
			phone = phone.substring(widthPhone-1);
			email = email.substring(widthEmail-1);
		}
		console.log('+'+buildLine(widthName,'-')+'+'+buildLine(widthPhone,'-')+'+'+buildLine(widthEmail,'-')+'+');
	}
};

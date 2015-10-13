'use strict';

var phoneBook = []; 

module.exports.add = add;
module.exports.find = find;
module.exports.remove = remove;
module.exports.importFromCsv = importFromCsv;
module.exports.showTable = showTable;

function validityPhone(str){
	//var r = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
	//var r = /^[\d+]{1,2}\ \([\d]{2,3}\)\ [\d]{2,3}-[\d]{2,3}-[\d]{2,3}$/;
	//return r.test(str);
	//пытался использовать регулярки, но так и не придумал хорошую((
	
	var i;
	var amountNumber = 0;
	var flag = 0; // значение флага: 0-нет "("; 1-есть "("; 2-есть "("и")"
	
	if(str[0] === '+'){
		i=1;
	} else {
		i=0;
	}
	if(str[i] === '-'){
		return false;
	}
	
	for(i;i<str.length;i++){
		if(Number(str[i]) || str[i] === '-' || str[i] === ' '){
			if(Number(str[i])){
				amountNumber++;
			}
			if(str[i] === '-' && (str[i-1] === ')' || str[i-1] === '-')){
				return false;
			}
		} else{
			if(str[i] === '(' && amountNumber<3 && str[i-1] !== '+'){ // проверка правильности постановки скобок
				if(flag === 0){
					flag++;
				} else{
					return false;
				}
			} else{
				if(str[i] === ')' && flag === 1 && str[i-4] === '('){
					flag++;
				} else{
					return false;
				}
			}
		}
	}
	
	return flag !== 1 && amountNumber>=10;
}

function validityMail(str){
	var r = /^[\w\.\d-_]+@[\w\.\d-_а-я]+\.[\wа-я]{2,4}$/i;
	return r.test(str);
}

function formattingPhone(phone){
	var re = /\d+/g;
	var cleanPhone =  phone.match(re).join('');
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

function addingSpaces(n){
	var result = '';
	for(var i=0;i<=n;i++){
		result += ' ';
	}
	return result;
}

function add(name, phone, email){
	var user = {
		name: name,
		phone: phone,
		email: email
	};
	
	if (!(validityPhone(phone) && validityMail(email))) {
		return false;
	};
	phoneBook.push(user);
	return true;
};

function find(query){
	if(query === ''){
		for(var i=0;i<phoneBook.length;i++){
			console.log(phoneBook[i].name+', '+phoneBook[i].phone+', '+phoneBook[i].email);
		}
		return;
	}
	for(var i=0;i<phoneBook.length;i++){
		if(phoneBook[i].name.indexOf(query)+1 || 
		phoneBook[i].phone.indexOf(query)+1 || 
		phoneBook[i].email.indexOf(query)+1){
			console.log(phoneBook[i].name+', '+phoneBook[i].phone+', '+phoneBook[i].email);
		}
	}
};

function remove(query){
	for(var i=0;i<phoneBook.length;i++){
		if(phoneBook[i].name.indexOf(query)+1 || 
		phoneBook[i].phone.indexOf(query)+1 || 
		phoneBook[i].email.indexOf(query)+1){
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
	var name;
	var phone;
	var email;
	
	console.log('┌───────────────────┬───────────────────────┬───────────────────────────────┐');
	console.log('│ Имя               │ Телефон               │ email                         │');
	console.log('├───────────────────┼───────────────────────┼───────────────────────────────┤');
	
	for(var i=0;i<phoneBook.length;i++){
		name = phoneBook[i].name + addingSpaces(17-phoneBook[i].name.length);
		phone = formattingPhone(phoneBook[i].phone) + addingSpaces(21-formattingPhone(phoneBook[i].phone).length);
		email = phoneBook[i].email + addingSpaces(29-phoneBook[i].email.length);
		
		console.log('│ '+name+'│ '+phone+'│ '+email+'│');
	};
	
	console.log('└───────────────────┴───────────────────────┴───────────────────────────────┘');
};

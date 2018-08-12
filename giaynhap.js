
class ISort{

	sort(){
		throw new Error("Not Implement") 
	}
	async move(x,y,data,data2)
	{
		(this.eventMoving)&& ( await this.eventMoving(x,y,data,data2))
 	 
	}
	async doneMove(data)
	{
 		
		(this.eventMoved)&&( await this.eventMoved(data))
	}
	async done(data)
	{
	(this.eventDone)&&( await this.eventDone(data))	
	}
}
class Radix extends ISort
{
	async sort(input)
	{
		let	output = input.slice(0);
		let getMax = function(input)
			{
				if (!input||input.length<0) return 0;
				var max = input[0];
				for (var i in input)
				{
					if (max < input[i])
					{
						max = input[i];
					}
				}
				return max;
			}
			let max = getMax(input);
			for (var i =1 ; Math.floor(max/i)>0;i*=10)
				output = await this.counting(output,i);
			await this.done(output);
			return output;
	}
	async counting(input,exp=1)
	{
		var	countArray = [];
		var output = [];
		 
		for (var i=0;i<10;i++){
			countArray[i] = 0;
		}
		for (var i in input)
		{
			countArray[Math.floor(input[i]/exp)%10]+=1;
		}
		for (i=1;i<10;i++)
		{
			countArray[i]+=countArray[i-1];
		}
		for (var k = input.length -1 ;k>=0;k--)
		{
			let moveTo  = Math.floor(input[k]/exp)%10;
			let toVal = countArray[moveTo] - 1
			output[toVal]=input[k];
			await this.move(-1,toVal,input[k])
			countArray[moveTo]--;
		}
		await this.doneMove(output)
		await this.done(output);
		return output;
	}
	 
}


class Select extends ISort
{
	async sort(input)
	{
		let output = input.slice()
		for (var i =0 ;i<output.length;i++){
			for (var j = i+1;j<output.length;j++){
				if (output[i]>output[j])
				{
					output[i] +=output[j];
					output[j] = output[i] - output[j];
					output[i] -=  output[j];
					await this.move(i,j,output[i],output[j])
				}
			}
			await this.doneMove(output)
		}
		await this.done(output);
		return output;
	}
	 
	 
}



class Bubble extends ISort
{
	async sort(input)
	{
		let output = input.slice()
		for (var i =0 ;i<output.length-1;i++){
			for (var j =0;j<output.length-i-1;j++){
				if (output[j]>output[j+1])
				{
					output[j+1] +=output[j];
					output[j] = output[j+1] - output[j];
					output[j+1] -=  output[j];
					await this.move(j+1,j,output[j+1],output[j])
				}
			}
			await this.doneMove(output)
		}
		await this.done(output);
		return output;
	}
	 
	
}



class Insert extends ISort
{
	async sort(input)
	{
		let output = input.slice()
		for (var i =1 ;i<output.length ;i++){
		 	let key = output[i];
		 	let j = i-1;
		 	while (j>=0&&key<output[j])
		 	{
		 		output[j+1]= output[j];
		 		await this.move(j+1,j,output[j+1],output[j] )
		 		j--;
		 	}
		 	output[j+1] = key;
		 	await this.move(j+1,j,key,output[j] )
		 	await this.doneMove(output);
		}
 		await this.done(output);
		return output;
	}
	 
 
}


class Merge extends ISort
{
	async sort(input)
	{
		let output = input.slice()
		 
 		output = await this.merge(output)
 	 
 		await this.done(output);
		return output;
	}
 	async merge(input,start=0){
 		
 		let mid = Math.floor(input.length/2);
 		let right = input.length;
 		if (right<=1) return input;
 		let arrLeft = input.slice(0,mid);
 		let arrRight = input.slice(mid ,right);
 		arrLeft = await this.merge(arrLeft ,start);
 		arrRight = await this.merge(arrRight,mid+start);
 		let result = [];
 		var j =0; 
 		var i=0;
 		var k =0;
 		while (j < arrRight.length && i < arrLeft.length)
 		{
 			if (arrLeft[i]<arrRight[j])
 			{
 				result[k] = (arrLeft[i]);
 				i++;
 			}
 			else{
 				result[k] = (arrRight[j]);
 				j++;
 			}
 			 await this.move(-1,k+start,result[k] )
 			k++
 			
 		}
 		
		while (i < arrLeft.length )
		{
			result.push(arrLeft[i]);
			i++;
			 await this.move(-1,k+start,result[k] )
 			 k++
		}
		while (j < arrRight.length )
 		{
 			 result.push(arrRight[j]);
 			  await this.move(-1,k+start,result[k] )
 			  k++
 			j++;
 		}
	 	await this.doneMove(result);

 		return result;
 	}
}

class Quick extends ISort
{
	async sort(input)
	{
		let output = input.slice()
 		output= await this.quickSort(output,0,output.length-1);
 		await this.done(output);
		return output;
	}
	async quickSort(input,left,right)
	{
		if (left<right){ 
		var pov = await this.partition(input,left,right);	 
		await	 this.doneMove(input);
		await this.quickSort(input,left,pov-1);
		await this.quickSort(input,pov+1,right);
		}
		return input;
	}
	async partition(input,left,right)
	{
		var i = left + 1 ;
		for (var j = left + 1 ; j <= right;j++)
		{
			if (input[left]>input[j])
			{
				//swap
			 	var temp = input[i];
			 	input[i] = input[j];
			 	input[j] = temp;
				await this.move(i,j,input[i],input[j])
				i++;
			}
		}
		//swap
		var temp = input[i-1];
	 	input[i-1] = input[left];
	 	input[left] = temp;
		await this.move(i-1,left,input[i-1],input[left])
		
		return i-1;
	}
 
}


class Heap extends ISort
{
	async sort(input)
	{
		let output = input.slice()
 		output= await this.heapSort(output);
 		await this.done(output);
		return output;
	}
	async heapSort(input)
	{
		for (var i = Math.floor(input.length/2)-1; i>=0 ;i--)
			await this.build(input,input.length,i);

		//move max to end
		for (var i = Math.floor(input.length)-1; i>=0 ;i--) 
		{
			var temp = input[i];
			input[i] = input[0];
			input[0] = temp;
			await this.move(i,0,input[i],input[0])
			
			await this.build(input,i,0);	

		}
			await this.doneMove(input)
		return input;
	}
	async build(input,n,i)
	{
 		
		var larg   = i;
		let left = 2*i+1;
		let right = 2*i+2;
		// create max heap
		if (left < n && input[left]> input[larg])
			larg = left;
		if (right < n && input[right] > input[larg])
			larg = right;
		if (larg !=i)
		{
			//swap 
			var temp = input[larg];
			input[larg] = input[i] ;
			input[i] = temp;
			await this.move(i,larg,input[i],input[larg])
			await this.build(input,n,larg)
		}
	 
	}
 
}
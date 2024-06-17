package com.app.utilts;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.charset.Charset;

import org.json.JSONArray;
import org.springframework.stereotype.Component;

@Component
public class JsonParserUtils {

	public static JSONArray readFile(String fileName) {
		
		ClassLoader classLoader = JsonParserUtils.class.getClassLoader();
		
		try (InputStream is = classLoader.getResourceAsStream(fileName);
				ReadableByteChannel rbc = Channels.newChannel(is)) {
			
//			// 創建 ByteBuffer 區塊 (1024 Byte 大小)
//			ByteBuffer buffer = ByteBuffer.allocate(1024 * 100);
			
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ByteBuffer buffer = ByteBuffer.allocate(1024 * 100);
			while (rbc.read(buffer) != -1) {
				buffer.flip();
				baos.write(buffer.array(), 0, buffer.limit());
				buffer.clear();
			}
			
//			rbc.read(buffer);
//			buffer.flip(); // limit 改為 position
//			Charset cs = Charset.defaultCharset();
//			System.out.println(cs.decode(buffer));
			
			// Convert to string using default charset
			String jsonStr = new String(baos.toByteArray(), Charset.defaultCharset());
			
			return new JSONArray(jsonStr);

		} catch (IOException e) {
			throw new RuntimeException("Error reading JSON file " + fileName, e);
		}
	}

}
